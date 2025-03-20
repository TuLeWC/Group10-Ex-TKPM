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
} from '../controllers/studentController.js';

const router = express.Router();

// Config multer
const upload = multer({ dest: 'uploads/' });

router.get('/', getAllStudents);

router.get('/:id', getStudentById);

router.post('/', createStudent);

router.put('/:id', updateStudent);

router.delete('/:id', deleteStudent);

router.get('/search', searchStudent);

// Import and export data
router.get('/export/csv', exportToCSV);
router.post('/import/csv', upload.single('file'), importFromCSV);

router.post('/import/json', importFromJSON);

export default router;
