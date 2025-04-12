import Class from '../models/Class.js';
import Semester from '../models/Semester.js';
import logger from '../utils/logger.js';

// api/classes

export const createClass = async (req, res) => {
  try {
    const cls = new Class(req.body);
    await cls.save();

    const createdClass = await Class.findById(cls._id)
      .populate('course', 'name')
      .populate('semester', 'name');

    logger.info(`Class created: ${createdClass.classId}`);
    res.status(201).json(createdClass);
  } catch (error) {
    logger.error(`Error creating class: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
