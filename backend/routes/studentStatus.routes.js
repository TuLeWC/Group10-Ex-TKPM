import express from 'express';
import {
  createStudentStatus,
  getAllStudentStatuses,
  updateStudentStatus,
  deleteStudentStatus,
} from '../controllers/studentStatus.controller.js';

const studentStatusRouter = express.Router();

// Create a new student status
studentStatusRouter.post('/', createStudentStatus);

// Get all student statuses
studentStatusRouter.get('/', getAllStudentStatuses);

// Update a student status
studentStatusRouter.put('/:id', updateStudentStatus);

// Delete a student status
studentStatusRouter.delete('/:id', deleteStudentStatus);

export default studentStatusRouter;
