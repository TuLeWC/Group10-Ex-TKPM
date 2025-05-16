import express from 'express';
import {
  createFaculty,
  getAllFaculties,
  updateFaculty,
  deleteFaculty,
} from '../controllers/faculty.controller.js';
import { facultyValidator } from '../validators/faculty.validator.js';
import validateRequest from '../middlewares/validateRequest.middleware.js';

const facultyRouter = express.Router();

// Create a new faculty
facultyRouter.post('/', facultyValidator, validateRequest, createFaculty);

// Get all faculties
facultyRouter.get('/', getAllFaculties);

// Update a faculty name
facultyRouter.put('/:id', facultyValidator, validateRequest, updateFaculty);

// Delete a faculty
facultyRouter.delete('/:id', deleteFaculty);

export default facultyRouter;
