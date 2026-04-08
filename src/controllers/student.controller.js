const studentService = require('../services/student.service');

const handleError = (res, err) => {
  if (err.status) return res.status(err.status).json({ error: err.message });
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
};

const getAll = (req, res) => {
  try {
    res.status(200).json(studentService.getAllStudents());
  } catch (err) {
    handleError(res, err);
  }
};

const getById = (req, res) => {
  try {
    res.status(200).json(studentService.getStudentById(req.params.id));
  } catch (err) {
    handleError(res, err);
  }
};

const create = (req, res) => {
  try {
    res.status(201).json(studentService.createStudent(req.body));
  } catch (err) {
    handleError(res, err);
  }
};

const replace = (req, res) => {
  try {
    res.status(200).json(studentService.replaceStudent(req.params.id, req.body));
  } catch (err) {
    handleError(res, err);
  }
};

const update = (req, res) => {
  try {
    res.status(200).json(studentService.patchStudent(req.params.id, req.body));
  } catch (err) {
    handleError(res, err);
  }
};

const remove = (req, res) => {
  try {
    studentService.deleteStudent(req.params.id);
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { getAll, getById, create, replace, update, remove };
