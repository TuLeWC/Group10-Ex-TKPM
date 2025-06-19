import { Router } from 'express';
import {
  createClass,
  getAllClasses,
  getClassById,
  deleteClassById
} from '../controllers/class.controller.js';

const classRouter = Router();

classRouter.get('/', getAllClasses);

classRouter.get('/:classId', getClassById);

classRouter.post('/', createClass);

classRouter.delete('/:classId', deleteClassById);

export default classRouter;
