import { Router } from 'express';
import {
  getAllEnrollments,
  getEnrollmentByStudentId,
  createEnrollment,
  cancelEnrollment,
  getStudentGrades,
  updateStudentGrade,
} from '../controllers/enrollment.controller.js';

const enrollmentRouter = Router();

enrollmentRouter.get('/', getAllEnrollments);

enrollmentRouter.get('/student/:studentId', getEnrollmentByStudentId);

enrollmentRouter.post('/', createEnrollment);

enrollmentRouter.post('/cancel', cancelEnrollment);

enrollmentRouter.get('/students/:studentId/grades', getStudentGrades);

enrollmentRouter.put(
  '/students/:studentId/classes/:classId/grades',
  updateStudentGrade
);
export default enrollmentRouter;
