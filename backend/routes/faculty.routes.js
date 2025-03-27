import express from 'express';
import {
  createFaculty,
  getAllFaculties,
  updateFaculty,
  deleteFaculty,
} from '../controllers/faculty.controller.js';

const facultyRouter = express.Router();

// Create a new faculty
facultyRouter.post('/', createFaculty);

// Get all faculties
facultyRouter.get('/', getAllFaculties);

// Update a faculty name
facultyRouter.put('/:id', updateFaculty);

// Delete a faculty
facultyRouter.delete('/:id', deleteFaculty);

export default facultyRouter;
