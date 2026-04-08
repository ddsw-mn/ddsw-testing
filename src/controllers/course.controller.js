const courseService = require('../services/course.service');

const handleError = (res, err) => {
  if (err.status) return res.status(err.status).json({ error: err.message });
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
};

const getAll = (req, res) => {
  try {
    const filters = {};
    if (req.query.year !== undefined) {
      const year = parseInt(req.query.year, 10);
      if (isNaN(year)) return res.status(400).json({ error: 'year must be a number' });
      filters.year = year;
    }
    res.status(200).json(courseService.getAllCourses(filters));
  } catch (err) {
    handleError(res, err);
  }
};


const getById = (req, res) => {
  try {
    res.status(200).json(courseService.getCourseById(req.params.id));
  } catch (err) {
    handleError(res, err);
  }
};

const create = (req, res) => {
  try {
    res.status(201).json(courseService.createCourse(req.body));
  } catch (err) {
    handleError(res, err);
  }
};

const replace = (req, res) => {
  try {
    res.status(200).json(courseService.replaceCourse(req.params.id, req.body));
  } catch (err) {
    handleError(res, err);
  }
};

const update = (req, res) => {
  try {
    res.status(200).json(courseService.patchCourse(req.params.id, req.body));
  } catch (err) {
    handleError(res, err);
  }
};

const remove = (req, res) => {
  try {
    courseService.deleteCourse(req.params.id);
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
};

const getStudents = (req, res) => {
  try {
    res.status(200).json(courseService.getCourseStudents(req.params.courseId));
  } catch (err) {
    handleError(res, err);
  }
};

const getStudentAssignments = async (req, res) => {
  try {
    const data = await courseService.getCourseStudentAssignments(
      req.params.courseId,
      req.params.studentId
    );
    res.status(200).json(data);
  } catch (err) {
    handleError(res, err);
  }
};

const addStudent = (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) return res.status(400).json({ error: 'Missing required field: studentId' });
    res.status(200).json(courseService.addStudentToCourse(req.params.courseId, studentId));
  } catch (err) {
    handleError(res, err);
  }
};

const createAssignment = async (req, res) => {
  try {
    const data = await courseService.createCourseAssignment(
      req.params.courseId,
      req.params.studentId,
      req.body
    );
    res.status(201).json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { getAll, getById, create, replace, update, remove, getStudents, getStudentAssignments, addStudent, createAssignment };
