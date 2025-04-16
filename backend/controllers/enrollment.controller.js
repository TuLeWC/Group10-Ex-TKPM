import logger from '../utils/logger.js';
import Class from '../models/Class.js';
import Enrollment from '../models/Enrollment.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';

// api/enrollments

export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'studentId')
      .populate('class', 'classId');

    logger.info('Fetched all enrollments');
    res.status(200).json(enrollments);
  } catch (error) {
    logger.error(`Error fetching enrollments: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const getEnrollmentByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if student exists
    const student = await Student.findOne({ studentId });
    if (!student) {
      logger.info(`Student with ID ${studentId} not found`);
      return res.status(404).json({ message: 'Student not existed' });
    }

    // Find all enrollment of student
    const enrollments = await Enrollment.find({ student: student._id })
      .populate('student', 'studentId')
      .populate('class', 'classId');

    if (enrollments.length === 0) {
      logger.info(`No enrollments found for student with ID ${studentId}`);
      return res.status(404).json({ message: 'No enrollments found' });
    }

    logger.info(`Fetched enrollments for student with ID ${studentId}`);
    res.status(200).json(enrollments);
  } catch (error) {
    logger.error(`Error fetching enrollment: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const updateEnrollment = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    // Check if class exists
    const cls = await Class.findOne({ classId });
    if (!cls) {
      logger.info(`Class with ID ${classId} not found`);
      return res.status(404).json({ message: 'Class is not existed' });
    }

    // Check if student exists
    const student = await Student.findOne({ studentId });
    if (!student) {
      logger.info(`Student with ID ${studentId} not found`);
      return res.status(404).json({ message: 'Student is not existed' });
    }
  } catch (error) {
    logger.error(`Error updating enrollment: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const createEnrollment = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    // Check if class exists
    const cls = await Class.findOne({ classId });
    if (!cls) {
      logger.info(`Class with ID ${classId} not found`);
      return res.status(404).json({ message: 'Class is not existed' });
    }

    // Check if student exists
    const student = await Student.findOne({ studentId });
    if (!student) {
      logger.info(`Student with ID ${studentId} not found`);
      return res.status(404).json({ message: 'Student is not existed' });
    }

    // Check if student is already enrolled in any class of the same course
    const otherClassIds = await Class.find({ course: cls.course }).distinct(
      '_id'
    );

    const existingEnrollment = await Enrollment.findOne({
      student: student._id,
      class: { $in: otherClassIds },
      status: { $ne: 'canceled' }, // Chỉ tính các đăng ký chưa bị huỷ
    });

    if (existingEnrollment) {
      logger.info(
        `Student with ID ${studentId} is already enrolled in another class of course ${cls.course}`
      );
      return res.status(400).json({
        message: 'Student is already enrolled in a class for this course',
      });
    }

    // Check if class is full
    if (cls.currentCapacity >= cls.maxCapacity) {
      logger.info(`Class with ID ${classId} is full`);
      return res.status(400).json({ message: 'Class is full' });
    }

    // Check for prerequisites
    const unmetPrerequisites = []; // List of unmet prerequisites
    // Get the course of the class
    const course = await Course.findById(cls.course);

    for (const prerequisite of course.prerequisites) {
      const isCompleted = await Enrollment.exists({
        student: student._id,
        status: 'completed',
        class: prerequisite,
      });
      if (!isCompleted) {
        unmetPrerequisites.push(prerequisite);
      }
    }

    if (unmetPrerequisites.length > 0) {
      logger.info(
        `Student with ID ${studentId} has unmet prerequisites for class ${classId}`
      );
      return res.status(400).json({
        message: 'Student has unmet prerequisites',
      });
    }

    // Create the enrollment
    const enrollment = new Enrollment({
      student: student._id,
      class: cls._id,
    });
    await enrollment.save();

    // Update class current capacity
    cls.currentCapacity += 1;
    await cls.save();

    // Populate the enrollment with class and student details
    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('student', 'studentId')
      .populate('class', 'classId');

    logger.info(`Student with ID ${studentId} enrolled in class ${classId}`);
    res.status(201).json(populatedEnrollment);
  } catch (error) {
    logger.error(`Error creating enrollment: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const cancelEnrollment = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    // Check if student exists
    const student = await Student.findOne({ studentId });
    if (!student) {
      logger.info(`Student with ID ${studentId} not found`);
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if class exists
    const cls = await Class.findOne({ classId }).populate('semester');
    if (!cls) {
      logger.info(`Class with ID ${classId} not found`);
      return res.status(404).json({ message: 'Class not found' });
    }

    // Find the enrollment
    const enrollment = await Enrollment.findOne({
      student: student._id,
      class: cls._id,
    });

    if (!enrollment) {
      logger.info(
        `Enrollment not found for student ${studentId} in class ${classId}`
      );
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // If the enrollment is already canceled
    if (enrollment.status === 'canceled') {
      logger.info(
        `Enrollment already canceled for student ${studentId} in class ${classId}`
      );
      return res.status(400).json({ message: 'Enrollment already canceled' });
    }

    // Check for cancellation deadline
    const currentDate = new Date();

    // Get academic year of the class
    const academicYearStr = cls.academicYear;

    // Parse cancellationDeadline string into Date object
    const [deadlineDay, deadlineMonth] =
      cls.semester.cancellationDeadline.split('-');

    const cancellationDeadlineDate = new Date(
      academicYearStr,
      parseInt(deadlineMonth) - 1,
      parseInt(deadlineDay)
    );

    if (currentDate > cancellationDeadlineDate) {
      logger.info(`Cancellation deadline has passed for class ${classId}`);
      return res
        .status(400)
        .json({ message: 'Cancellation deadline has passed' });
    }

    // Update the enrollment status to canceled
    enrollment.status = 'canceled';
    enrollment.cancellationDate = new Date();
    await enrollment.save();

    logger.info(
      `Enrollment canceled for student ${studentId} in class ${classId}`
    );
    res.status(200).json({
      message: `Enrollment canceled successfully for student: ${studentId} in class: ${classId}`,
    });
  } catch (error) {
    logger.error(`Error canceling enrollment: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const getStudentGrades = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if student exists
    const student = await Student.findOne({ studentId });
    if (!student) {
      logger.info(`Student with ID ${studentId} not found`);
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find all enrollments for the student, populating class's course and grade
    const enrollments = await Enrollment.find({
      student: student._id,
    }).populate({
      path: 'class',
      populate: {
        path: 'course',
        select: 'courseId name',
      },
    });

    // Create response object with classId, courseId, and grade
    const results = enrollments.map((enrollment) => ({
      courseId: enrollment.class?.course?.courseId || 'N/A',
      courseName: enrollment.class?.course?.name || 'N/A',
      grade: enrollment.grade,
    }));

    logger.info(`Fetched grades for student with ID ${studentId}`);
    res.status(200).json(results);
  } catch (error) {
    logger.error(`Error fetching student grades: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
