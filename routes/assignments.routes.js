import { Router } from 'express';
import Controller from '../controllers/controller.js';

const router = Router();

router.get('/', (req, res, next) => Controller.getUsersAssignments(req, res, next));
router.get('/:userId', (req, res, next) => Controller.getUserAssignment(req, res, next));

export default router;
