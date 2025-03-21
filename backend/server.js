import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from './utils/logger.js';

import studentRoutes from './routes/studentRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import programRoutes from './routes/programRoutes.js';
import studentStatusRoutes from './routes/studentStatusRoutes.js';


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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
