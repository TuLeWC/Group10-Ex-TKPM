import { Router } from 'express';
import {
  getAllEnrollments,
  getEnrollmentByStudentId,
  createEnrollment,
  cancelEnrollment,
  getStudentGrades,
} from '../controllers/enrollment.controller.js';

const enrollmentRouter = Router();

enrollmentRouter.get('/', getAllEnrollments);

enrollmentRouter.get('/student/:studentId', getEnrollmentByStudentId);

enrollmentRouter.post('/', createEnrollment);

enrollmentRouter.post('/cancel', cancelEnrollment);

enrollmentRouter.get('/:studentId/grades', getStudentGrades);
export default enrollmentRouter;
