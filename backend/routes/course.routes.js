import { Router } from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
  updateCourse,
} from '../controllers/course.controller.js';

const courseRouter = Router();

courseRouter.get('/', getAllCourses);

courseRouter.get('/:id', getCourseById);

courseRouter.post('/', createCourse);

courseRouter.delete('/:id', deleteCourse);

courseRouter.put('/:id', updateCourse);

export default courseRouter;
