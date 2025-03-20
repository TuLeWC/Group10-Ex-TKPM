import express from 'express';
import {
  createFaculty,
  getAllFaculties,
  updateFaculty,
  deleteFaculty,
} from '../controllers/facultyController.js';

const router = express.Router();

// Create a new faculty
router.post('/', createFaculty);

// Get all faculties
router.get('/', getAllFaculties);

// Update a faculty name
router.put('/:id', updateFaculty);

// Delete a faculty
router.delete('/:id', deleteFaculty);

export default router;
