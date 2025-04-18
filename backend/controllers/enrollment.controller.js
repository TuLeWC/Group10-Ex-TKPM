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
      .populate({
        path: 'class', // Populate the class field
        populate: [
          {
            path: 'course', // Populate the course field inside class
            select: 'name courseId', // Select only name and courseId from course
          },
          {
            path: 'semester', // Populate the semester field inside class
            select: 'semesterId name', // Select only semesterId from semester
          },
        ],
      });

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

// export const updateEnrollment = async (req, res) => {
//   try {
//     const { studentId, classId } = req.body;

//     // Check if class exists
//     const cls = await Class.findOne({ classId });
//     if (!cls) {
//       logger.info(`Class with ID ${classId} not found`);
//       return res.status(404).json({ message: 'Class is not existed' });
//     }

//     // Check if student exists
//     const student = await Student.findOne({ studentId });
//     if (!student) {
//       logger.info(`Student with ID ${studentId} not found`);
//       return res.status(404).json({ message: 'Student is not existed' });
//     }
//   } catch (error) {
//     logger.error(`Error updating enrollment: ${error.message}`);
//     res.status(500).json({ message: error.message });
//   }
// };

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
      status: 'active', // Only consider active enrollments
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

    for (const prerequisiteId of course.prerequisites) {
      // Find classes belonging to the prerequisite course
      const prerequisiteClasses = await Class.find({
        course: prerequisiteId,
      }).distinct('_id');

      const isCompleted = await Enrollment.exists({
        student: student._id,
        status: 'completed',
        class: { $in: prerequisiteClasses },
      });
      if (!isCompleted) {
        unmetPrerequisites.push(prerequisiteId);
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
      .populate({
        path: 'class', // Populate the class field
        populate: [
          {
            path: 'course', // Populate the course field inside class
            select: 'name courseId', // Select only name and courseId from course
          },
          {
            path: 'semester', // Populate the semester field inside class
            select: 'semesterId name', // Select only semesterId from semester
          },
        ],
      });

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

    // Check if enrollment exists
    // Find the enrollment
    const enrollment = await Enrollment.findOne({
      student: student._id,
      class: cls._id,
      status: 'active', // Only consider active enrollments
    });

    if (!enrollment) {
      logger.info(
        `No active enrollment found for student ${studentId} in class ${classId}`
      );
      return res.status(404).json({ message: 'No active enrollment found' });
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

    // Update enrollment information
    enrollment.status = 'canceled'; // Update the enrollment status to canceled
    enrollment.cancellationDate = new Date();
    enrollment.grade = null; // Reset grade to null

    cls.currentCapacity -= 1; // Decrease the current capacity of the class
    await cls.save(); // Save the updated class

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

    // Only fetch completed or failed enrollments
    const enrollments = await Enrollment.find({
      student: student._id,
      status: { $in: ['completed', 'failed'] },
    }).populate({
      path: 'class',
      populate: {
        path: 'course',
        select: 'courseId name',
      },
    });

    // Prepare response
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

export const updateStudentGrade = async (req, res) => {
  try {
    const { studentId, classId } = req.params;

    const { grade } = req.body;

    // Check for valid grade
    if (typeof grade !== 'number' || grade < 0 || grade > 10) {
      logger.info(`Invalid grade value: ${grade}`);
      return res.status(400).json({ message: 'Invalid grade value' });
    }

    // Check if student exists
    const student = await Student.findOne({ studentId });

    if (!student) {
      logger.info(`Student with ID ${studentId} not found`);
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if class exists
    const cls = await Class.findOne({ classId });

    if (!cls) {
      logger.info(`Class with ID ${classId} not found`);
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if enrollment exists
    const enrollment = await Enrollment.findOne({
      student: student._id,
      class: cls._id,
      status: { $ne: 'canceled' }, // Only consider non-canceled enrollments
    });

    if (!enrollment) {
      logger.info(
        `No active enrollment found for student ${studentId} in class ${classId}`
      );
      return res.status(404).json({ message: 'No active enrollment found' });
    }

    // Update enrollment information
    enrollment.grade = grade; // Update the enrollment grade
    enrollment.status = grade >= 5 ? 'completed' : 'failed'; // Update the enrollment status based on grade

    await enrollment.save();

    logger.info(`Grade updated for student ${studentId} in class ${classId}`);
    res.status(200).json({
      message: `Grade updated successfully for student: ${studentId} in class: ${classId}`,
    });
  } catch (error) {
    logger.error(`Error updating student grade: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
