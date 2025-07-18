import Class from '../models/Class.js';
import Course from '../models/Course.js';
import Semester from '../models/Semester.js';
import logger from '../utils/logger.js';
import { localizeObject } from '../utils/i18n/index.js';

// api/classes

export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('course', 'courseId name')
      .populate('semester', 'semesterId name')
      .lean();

    logger.info('Fetched all classes');
    res.status(200).json(localizeObject(classes, req.lang));
  } catch (error) {
    logger.error(`Error fetching classes: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const getClassById = async (req, res) => {
  try {
    const { classId } = req.params;

    const cls = await Class.findOne({ classId })
      .populate('course', 'courseId name')
      .populate('semester', 'semesterId name')
      .lean();

    // Check if class exists
    if (!cls) {
      logger.info(`Class with ID ${classId} not found`);
      return res.status(404).json({ message: 'Class not found' });
    }

    logger.info(`Fetched class: ${cls.classId}`);
    res.status(200).json(localizeObject(cls, req.lang));
  } catch (error) {
    logger.error(`Error fetching class: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const createClass = async (req, res) => {
  try {
    const { semesterId, courseId, ...classData } = req.body;

    // Check if semester exists
    const semester = await Semester.findOne({ semesterId });
    if (!semester) {
      logger.info(`Semester with ID ${semesterId} not found`);
      return res.status(404).json({ message: 'Semester is not existed' });
    }

    // Check if course exists
    const course = await Course.findOne({ courseId });
    if (!course) {
      logger.info(`Course with ID ${courseId} not found`);
      return res.status(404).json({ message: 'Course is not existed' });
    }

    // Create class
    const cls = new Class({
      ...classData,
      course: course._id,
      semester: semester._id,
    });
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

export const deleteClassById = async (req, res) => {
  try {
    const { classId } = req.params;
    const deletedClass = await Class.findOneAndDelete({ classId });

    if (!deletedClass) {
      logger.info(`Class with ID ${classId} not found`);
      return res.status(404).json({ message: 'Class not found' });
    }

    logger.info(`Class deleted: ${classId}`);
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting class: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
