import Course from '../models/Course.js';
import Class from '../models/Class.js';
import Enrollment from '../models/Enrollment.js';
import logger from '../utils/logger.js';

// /api/courses

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('prerequisites', 'name')
      .populate('faculty', 'name');

    logger.info('Fetched all courses');

    res.status(200).json(courses);
  } catch (error) {
    logger.error(`Error fetching courses: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findOne({ courseId })
      .populate('prerequisites', 'name')
      .populate('faculty', 'name');

    if (!course) {
      logger.info(`Course with ID ${courseId} not found`);
      return res.status(404).json({ message: 'Course not found' });
    }

    logger.info(`Fetched course: ${course.name}`);
    res.status(200).json(course);
  } catch (error) {
    logger.error(`Error fetching course: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { prerequisites = [] } = req.body;

    // Check for existing prerequisites (if provided)
    if (!Array.isArray(prerequisites)) {
      return res
        .status(400)
        .json({ message: 'Prerequisites must be an array' });
    }

    let prerequisiteIds = [];
    if (prerequisites.length > 0) {
      const foundCourses = await Course.find({
        courseId: { $in: prerequisites },
      });

      if (foundCourses.length !== prerequisites.length) {
        return res
          .status(400)
          .json({ message: 'Some prerequisites do not exist' });
      }

      // Map the found courses to their IDs
      prerequisiteIds = foundCourses.map((course) => course._id);
    }

    // Create the course
    const course = new Course({
      ...req.body,
      prerequisites: prerequisiteIds,
    });
    await course.save();

    const createdCourse = await Course.findById(course._id)
      .populate('prerequisites', 'name')
      .populate('faculty', 'name');

    logger.info(`Course created: ${createdCourse.name}`);
    res.status(201).json(createdCourse);
  } catch (error) {
    logger.error(`Error creating course: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findOne({ courseId });
    if (!course) {
      logger.info(`Course with ID ${courseId} not found`);
      return res.status(404).json({ message: 'Course not found' });
    }

    // If the course is created over 30 minutes, deny deletion
    const now = new Date();
    const createdAt = course.createdAt;
    const minutesSinceCreation = (now - createdAt) / 1000 / 60;

    if (minutesSinceCreation > 30) {
      logger.warn(
        `Course ${course.name} cannot be deleted after 30 minutes creation `
      );
      return res.status(403).json({
        message: 'Course can only be deleted within 30 minutes of creation',
      });
    }

    // Check if there are linked classes
    const linkedClasses = await Class.find({ course: course._id });

    if (linkedClasses.length > 0) {
      // If there are linked classes, deactivate the course instead of deleting it
      if (!course.isActive) {
        logger.warn(
          `Course ${course.name} is already deactivated and has linked classes`
        );

        return res.status(400).json({
          message: 'Course has linked classes and is already deactivated',
        });
      }

      course.isActive = false;
      await course.save();

      logger.info(`Course ${course.name} deactivated due to linked classes`);

      return res
        .status(200)
        .json({ message: 'Course deactivated because it has linked classes' });
    }

    // If no linked classes, delete the course
    await course.deleteOne();

    logger.info(`Course deleted: ${course.name}`);

    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting course: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { name, description, faculty, credits } = req.body;

    const course = await Course.findOne({ courseId });
    if (!course) {
      logger.info(`Course with ID ${courseId} not found`);
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if courseId is requested to be changed
    if (req.body.courseId && req.body.courseId !== course.courseId) {
      logger.warn(`Course ID cannot be changed`);
      return res.status(400).json({ message: 'Course ID cannot be changed' });
    }

    // If credits is requested to be changed, check if there are students enrolled
    if (credits && credits !== course.credits) {
      // Find all linked classes
      const classes = await Class.find({ course: course._id });
      const classIds = classes.map((cls) => cls._id);

      // Check if there are students enrolled in these classes
      const hasEnrollments = await Enrollment.exists({
        class: { $in: classIds },
      });

      if (hasEnrollments) {
        logger.warn(`Credits cannot be changed after students have enrolled`);
        return res.status(400).json({
          message: 'Credits cannot be changed after students have enrolled',
        });
      }

      course.credits = credits;
    }

    // Update other fields
    course.name = name || course.name;
    course.description = description || course.description;
    course.faculty = faculty || course.faculty;

    await course.save();

    const updatedCourse = await Course.findById(course._id)
      .populate('prerequisites', 'name')
      .populate('faculty', 'name');

    logger.info(`Course updated: ${updatedCourse.name}`);
    res.status(200).json(updatedCourse);
  } catch (error) {
    logger.error(`Error updating course: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
