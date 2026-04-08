const { courses } = require('../db/store');

const findAll = () => courses;

const findById = (id) => courses.find((c) => c.id === id) || null;

const create = (courseData) => {
  courses.push(courseData);
  return courseData;
};

const update = (id, updatedData) => {
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return null;
  courses[index] = updatedData;
  return courses[index];
};

const patch = (id, fields) => {
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return null;
  courses[index] = { ...courses[index], ...fields };
  return courses[index];
};

const remove = (id) => {
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return false;
  courses.splice(index, 1);
  return true;
};

// Remove a studentId from every course that contains it
const removeStudentFromAll = (studentId) => {
  courses.forEach((course) => {
    course.studentIds = course.studentIds.filter((sid) => sid !== studentId);
  });
};

module.exports = { findAll, findById, create, update, patch, remove, removeStudentFromAll };
