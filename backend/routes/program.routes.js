import express from 'express';
import {
  createProgram,
  getAllPrograms,
  updateProgram,
  deleteProgram,
} from '../controllers/program.controller.js';

const programRouter = express.Router();

// Create a new program
programRouter.post('/', createProgram);

// Get all programs
programRouter.get('/', getAllPrograms);

// Update a program
programRouter.put('/:id', updateProgram);

// Delete a program
programRouter.delete('/:id', deleteProgram);

export default programRouter;
