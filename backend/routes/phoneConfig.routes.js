import express from 'express';
import {
  addPhoneConfig,
  deletePhoneConfig,
  getAllPhoneConfigs,
} from '../controllers/phoneConfig.controller.js';

const phoneConfigRouter = express.Router();

phoneConfigRouter.get('/', getAllPhoneConfigs);

phoneConfigRouter.post('/', addPhoneConfig);

phoneConfigRouter.delete('/:id', deletePhoneConfig);

export default phoneConfigRouter;
