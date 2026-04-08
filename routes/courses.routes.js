const { Router } = require('express');
const courseController = require('../src/controllers/course.controller');

const router = Router();

// GETs
//// Obtener todos los COURSES
router.get(/* completar aquí */ '', courseController.getAll);

//// Obtener un COURSE por id
router.get( /* completar aquí */ '', courseController.getById);

//// Obtener todos los STUDENTS de un determinado COURSE
router.get( /* completar aquí */ '', courseController.getStudents);

//// Obtener todas las ASSIGNMENTS de un determinado STUDENT dentro de un determinado COURSE
router.get( /* completar aquí */ '', courseController.getStudentAssignments);


// POST
//// Crear un COURSE
router.post( /* completar aquí */ '', courseController.create);

//// Agregar un STUDENT a un determinado COURSE  (body: { studentId })
router.post( /* completar aquí */ '', courseController.addStudent);

//// Crear una ASSIGNMENT para un determinado STUDENT dentro de un determinado COURSE  (body: { title })
router.post( /* completar aquí */ '', courseController.createAssignment);

// PUT
//// Reemplazar un determinado COURSE
router.put( /* completar aquí */ '', courseController.replace);

// PATCH
//// Actualizar algunos campos de un determinado COURSE
router.patch( /* completar aquí */ '', courseController.update);

// DELETE
//// Eliminar un determinado COURSE
router.delete( /* completar aquí */ '', courseController.remove);

module.exports = router;






















// Otras operaciones
router.post('/courses', courseController.create);
router.put('/courses/:id', courseController.replace);
router.patch('/courses/:id', courseController.update);
router.delete('/courses/:id', courseController.remove);

module.exports = router;
