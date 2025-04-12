import { Router } from 'express';
import {
  createClass,
  getAllClasses,
  getClassById,
} from '../controllers/class.controller.js';

const classRouter = Router();

classRouter.get('/', getAllClasses);

classRouter.get('/:classId', getClassById);

classRouter.post('/', createClass);

export default classRouter;
