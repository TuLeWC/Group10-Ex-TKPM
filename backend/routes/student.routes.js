import express from 'express';
import multer from 'multer';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudent,
} from '../controllers/student.controller.js';

import {
  studentValidator,
  statusValidator,
} from '../validators/student.validator.js';
import validateRequest from '../middlewares/validateRequest.middleware.js';

const studentRouter = express.Router();

// Config multer
const upload = multer({ dest: 'uploads/' });

studentRouter.get('/', getAllStudents);

studentRouter.get('/:id', getStudentById);

studentRouter.post('/', studentValidator, validateRequest, createStudent);

studentRouter.put(
  '/:id',
  [...studentValidator, ...statusValidator],
  validateRequest,
  updateStudent
);

studentRouter.delete('/:id', deleteStudent);

studentRouter.get('/search', searchStudent);

export default studentRouter;
