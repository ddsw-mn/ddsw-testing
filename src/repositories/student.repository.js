const { students } = require('../db/store');

const findAll = () => students;

const findById = (id) => students.find((s) => s.id === id) || null;

const create = (studentData) => {
  students.push(studentData);
  return studentData;
};

const update = (id, updatedData) => {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;
  students[index] = updatedData;
  return students[index];
};

const patch = (id, fields) => {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;
  students[index] = { ...students[index], ...fields };
  return students[index];
};

const remove = (id) => {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return false;
  students.splice(index, 1);
  return true;
};

module.exports = { findAll, findById, create, update, patch, remove };
