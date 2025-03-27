import express from 'express';
import {
  getAllEmailConfigs,
  addEmailConfig,
  deleteEmailConfig,
} from '../controllers/emailConfig.controller.js';

const emailConfigRouter = express.Router();

emailConfigRouter.get('/', getAllEmailConfigs);

emailConfigRouter.post('/', addEmailConfig);

emailConfigRouter.delete('/:id', deleteEmailConfig);

export default emailConfigRouter;
