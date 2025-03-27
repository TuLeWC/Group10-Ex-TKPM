import express from 'express';
import {
  getAllStatusTransitions,
  addStatusTransition,
  deleteStatusTransition,
} from '../controllers/statusTransitionConfig.controller.js';

const statusTransitionConfigRouter = express.Router();

statusTransitionConfigRouter.get('/', getAllStatusTransitions);

statusTransitionConfigRouter.post('/', addStatusTransition);

statusTransitionConfigRouter.delete('/:id', deleteStatusTransition);

export default statusTransitionConfigRouter;
