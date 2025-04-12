import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from './utils/logger.js';

import studentRoutes from './routes/student.routes.js';
import facultyRoutes from './routes/faculty.routes.js';
import programRoutes from './routes/program.routes.js';
import studentStatusRoutes from './routes/studentStatus.routes.js';
import emailConfigRouter from './routes/emailConfig.routes.js';
import phoneConfigRouter from './routes/phoneConfig.routes.js';
import statusTransitionConfigRouter from './routes/statusTransitionConfig.routes.js';
import courseRouter from './routes/course.routes.js';
import classRouter from './routes/class.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((error) => logger.error('MongoDB connection error: ', error));

app.use('/api/students', studentRoutes);
app.use('/api/faculties', facultyRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/student-statuses', studentStatusRoutes);
app.use('/api/email-configs', emailConfigRouter);
app.use('/api/phone-configs', phoneConfigRouter);
app.use('/api/status-transitions', statusTransitionConfigRouter);
app.use('/api/courses', courseRouter);
app.use('/api/classes', classRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on: http://localhost:${PORT}`)
);
