import { Router } from 'express';
import { createClass } from '../controllers/class.controller.js';

const classRouter = Router();

classRouter.post('/', createClass);

export default classRouter;