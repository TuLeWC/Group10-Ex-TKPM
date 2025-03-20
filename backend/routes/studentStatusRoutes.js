import express from 'express';
import {
  createStudentStatus,
  getAllStudentStatuses,
  updateStudentStatus,
  deleteStudentStatus,
} from '../controllers/studentStatusController.js';

const router = express.Router();

// Create a new student status
router.post('/', createStudentStatus);

// Get all student statuses
router.get('/', getAllStudentStatuses);

// Update a student status
router.put('/:id', updateStudentStatus);

// Delete a student status
router.delete('/:id', deleteStudentStatus);

export default router;
