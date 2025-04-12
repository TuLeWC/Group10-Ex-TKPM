import Class from '../models/Class.js';
import Course from '../models/Course.js';
import Semester from '../models/Semester.js';
import logger from '../utils/logger.js';

// api/classes

export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('course', 'courseId name')
      .populate('semester', 'semesterId name');

    logger.info('Fetched all classes');

    res.status(200).json(classes);
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
      .populate('semester', 'semesterId name');

    // Check if class exists
    if (!cls) {
      logger.info(`Class with ID ${classId} not found`);
      return res.status(404).json({ message: 'Class not found' });
    }

    logger.info(`Fetched class: ${cls.classId}`);
    res.status(200).json(cls);
  } catch (erorr) {
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
