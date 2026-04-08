const { Router } = require('express');
const studentsController = require('../src/controllers/student.controller');

const router = Router();

router.get('/students', studentsController.getAll);
router.get('/students/:id', studentsController.getById);
router.post('/students', studentsController.create);
router.put('/students/:id', studentsController.replace);
router.patch('/students/:id', studentsController.update);
router.delete('/students/:id', studentsController.remove);

module.exports = router;
