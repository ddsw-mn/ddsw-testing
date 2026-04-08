const crypto = require('crypto');
const studentRepository = require('../repositories/student.repository');
const courseRepository = require('../repositories/course.repository');

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'age', 'enrollmentYear', 'major'];

const validateFields = (data, requireAll = true) => {
  if (requireAll) {
    const missing = REQUIRED_FIELDS.filter((f) => data[f] === undefined || data[f] === null);
    if (missing.length > 0) {
      return `Missing required fields: ${missing.join(', ')}`;
    }
  }
  if (data.email !== undefined && typeof data.email !== 'string') {
    return 'email must be a string';
  }
  if (data.age !== undefined && (typeof data.age !== 'number' || data.age <= 0)) {
    return 'age must be a positive number';
  }
  if (data.enrollmentYear !== undefined && (typeof data.enrollmentYear !== 'number' || data.enrollmentYear < 1900)) {
    return 'enrollmentYear must be a valid year number';
  }
  return null;
};

const getAllStudents = () => studentRepository.findAll();

const getStudentById = (id) => {
  const student = studentRepository.findById(id);
  if (!student) throw { status: 404, message: `Student with id '${id}' not found` };
  return student;
};

const createStudent = (data) => {
  const error = validateFields(data, true);
  if (error) throw { status: 400, message: error };

  const student = {
    id: crypto.randomUUID(),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    age: data.age,
    enrollmentYear: data.enrollmentYear,
    major: data.major,
  };
  return studentRepository.create(student);
};

const replaceStudent = (id, data) => {
  const existing = studentRepository.findById(id);
  if (!existing) throw { status: 404, message: `Student with id '${id}' not found` };

  const error = validateFields(data, true);
  if (error) throw { status: 400, message: error };

  const updated = {
    id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    age: data.age,
    enrollmentYear: data.enrollmentYear,
    major: data.major,
  };
  return studentRepository.update(id, updated);
};

const patchStudent = (id, data) => {
  const existing = studentRepository.findById(id);
  if (!existing) throw { status: 404, message: `Student with id '${id}' not found` };

  const error = validateFields(data, false);
  if (error) throw { status: 400, message: error };

  // Disallow overriding id via patch
  const { id: _ignored, ...safeFields } = data;
  return studentRepository.patch(id, safeFields);
};

const deleteStudent = (id) => {
  const existing = studentRepository.findById(id);
  if (!existing) throw { status: 404, message: `Student with id '${id}' not found` };

  studentRepository.remove(id);
  // Cascade: remove this student from all courses
  courseRepository.removeStudentFromAll(id);
};

module.exports = { getAllStudents, getStudentById, createStudent, replaceStudent, patchStudent, deleteStudent };
