import express from 'express';
import multer from 'multer';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudent,
  exportToCSV,
  importFromCSV,
  importFromJSON,
} from '../controllers/student.controller.js';

const studentRouter = express.Router();

// Config multer
const upload = multer({ dest: 'uploads/' });

studentRouter.get('/', getAllStudents);

studentRouter.get('/:id', getStudentById);
studentRouter.post('/', createStudent);

studentRouter.put('/:id', updateStudent);

studentRouter.delete('/:id', deleteStudent);

studentRouter.get('/search', searchStudent);

// Import and export data
studentRouter.get('/export/csv', exportToCSV);
studentRouter.post('/import/csv', upload.single('file'), importFromCSV);
studentRouter.post('/import/json', importFromJSON);

export default studentRouter;
