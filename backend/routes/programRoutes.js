import express from 'express';
import {
  createProgram,
  getAllPrograms,
  updateProgram,
  deleteProgram,
} from '../controllers/programController.js';

const router = express.Router();

// Create a new program
router.post('/', createProgram);

// Get all programs
router.get('/', getAllPrograms);

// Update a program
router.put('/:id', updateProgram);

// Delete a program
router.delete('/:id', deleteProgram);

export default router;
