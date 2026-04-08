const crypto = require('crypto');
const courseRepository = require('../repositories/course.repository');
const studentRepository = require('../repositories/student.repository');

const REQUIRED_FIELDS = ['name', 'description', 'credits', 'department', 'schedule'];

const validateFields = (data, requireAll = true) => {
  if (requireAll) {
    const missing = REQUIRED_FIELDS.filter((f) => data[f] === undefined || data[f] === null);
    if (missing.length > 0) {
      return `Missing required fields: ${missing.join(', ')}`;
    }
  }
  if (data.credits !== undefined && (typeof data.credits !== 'number' || data.credits <= 0)) {
    return 'credits must be a positive number';
  }
  if (data.studentIds !== undefined && !Array.isArray(data.studentIds)) {
    return 'studentIds must be an array';
  }
  return null;
};

// Resolve an array of student IDs to full Student objects (unknown IDs are silently skipped)
const resolveStudents = (studentIds) =>
  (studentIds || [])
    .map((sid) => studentRepository.findById(sid))
    .filter(Boolean);

const withResolvedStudents = (course) => ({
  ...course,
  students: resolveStudents(course.studentIds),
  studentIds: undefined,
});

const getAllCourses = (filters = {}) => {
  let result = courseRepository.findAll();
  if (filters.year !== undefined) {
    result = result.filter((c) => c.year === filters.year);
  }
  return result.map(withResolvedStudents);
};

const getCourseById = (id) => {
  const course = courseRepository.findById(id);
  if (!course) throw { status: 404, message: `Course with id '${id}' not found` };
  return withResolvedStudents(course);
};

const createCourse = (data) => {
  const error = validateFields(data, true);
  if (error) throw { status: 400, message: error };

  const course = {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description,
    credits: data.credits,
    department: data.department,
    schedule: data.schedule,
    studentIds: Array.isArray(data.studentIds) ? data.studentIds : [],
  };
  const created = courseRepository.create(course);
  return withResolvedStudents(created);
};

const replaceCourse = (id, data) => {
  const existing = courseRepository.findById(id);
  if (!existing) throw { status: 404, message: `Course with id '${id}' not found` };

  const error = validateFields(data, true);
  if (error) throw { status: 400, message: error };

  const updated = {
    id,
    name: data.name,
    description: data.description,
    credits: data.credits,
    department: data.department,
    schedule: data.schedule,
    studentIds: Array.isArray(data.studentIds) ? data.studentIds : [],
  };
  const result = courseRepository.update(id, updated);
  return withResolvedStudents(result);
};

const patchCourse = (id, data) => {
  const existing = courseRepository.findById(id);
  if (!existing) throw { status: 404, message: `Course with id '${id}' not found` };

  const error = validateFields(data, false);
  if (error) throw { status: 400, message: error };

  const { id: _ignored, ...safeFields } = data;
  const result = courseRepository.patch(id, safeFields);
  return withResolvedStudents(result);
};

const deleteCourse = (id) => {
  const existing = courseRepository.findById(id);
  if (!existing) throw { status: 404, message: `Course with id '${id}' not found` };
  courseRepository.remove(id);
};

const getCourseStudents = (courseId) => {
  const course = courseRepository.findById(courseId);
  if (!course) throw { status: 404, message: `Course with id '${courseId}' not found` };
  return resolveStudents(course.studentIds);
};

const getCourseStudentAssignments = async (courseId, studentId) => {
  const course = courseRepository.findById(courseId);
  if (!course) throw { status: 404, message: `Course with id '${courseId}' not found` };

  const studentEnrolled = course.studentIds.includes(studentId);
  if (!studentEnrolled) {
    throw { status: 404, message: `Student with id '${studentId}' is not enrolled in course '${courseId}'` };
  }

  const numericId = parseInt(studentId, 10);
  if (isNaN(numericId)) {
    throw { status: 400, message: `studentId '${studentId}' cannot be mapped to an external assignment userId` };
  }

  // Lazy-require to avoid loading ESM chain at module level
  const { default: TodosAssignmentService } = await import('../../services/todos-assignment.service.js');
  const svc = new TodosAssignmentService();
  const { data } = await svc.getUserTodos(numericId);
  return data;
};

const addStudentToCourse = (courseId, studentId) => {
  const course = courseRepository.findById(courseId);
  if (!course) throw { status: 404, message: `Course with id '${courseId}' not found` };

  const student = studentRepository.findById(studentId);
  if (!student) throw { status: 404, message: `Student with id '${studentId}' not found` };

  if (course.studentIds.includes(studentId)) {
    throw { status: 409, message: `Student '${studentId}' is already enrolled in course '${courseId}'` };
  }

  const result = courseRepository.patch(courseId, { studentIds: [...course.studentIds, studentId] });
  return withResolvedStudents(result);
};

const createCourseAssignment = async (courseId, studentId, assignmentData) => {
  const course = courseRepository.findById(courseId);
  if (!course) throw { status: 404, message: `Course with id '${courseId}' not found` };

  if (!course.studentIds.includes(studentId)) {
    throw { status: 404, message: `Student with id '${studentId}' is not enrolled in course '${courseId}'` };
  }

  if (!assignmentData.title) throw { status: 400, message: 'Missing required field: title' };

  const { default: TodosAssignmentService } = await import('../../services/todos-assignment.service.js');
  const svc = new TodosAssignmentService();
  const { data } = await svc.createTodo({ ...assignmentData, userId: studentId });
  return data;
};

module.exports = { getAllCourses, getCourseById, createCourse, replaceCourse, patchCourse, deleteCourse, getCourseStudents, getCourseStudentAssignments, addStudentToCourse, createCourseAssignment };
