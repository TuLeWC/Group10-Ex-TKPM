const Student = require("../models/Student");
const logger = require("../utils/logger");

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    winston.info(`Fetched all students`);
    res.status(200).json(students);
  } catch (error) {
    logger.error(`Error fetching students: ${error.message}`)
    res.status(500).json({ message: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ studentID: req.params.id });
    if (!student) {
      winston.warn(`Student not found: ${req.params.id}`);
      return res.status(404).json({ message: "Student not found" });
    }
    logger.info(`Fetched student: ${student.studentId}`);
    res.status(200).json(student);
  } catch (error) {
    logger.error(`Error fetching student: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Create a student
exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    logger.info(`Student created: ${student.studentId}`)
    res.status(201).json(student);
  } catch (error) {
    logger.error(`Error creating student: ${error.message}`)
    res.status(400).json({ message: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedStudent) {
      winston.warn(`Student not found for update: ${req.params.id}`);
      return res.status(404).json({ message: "Student not found" });
    }
    logger.info(`Updated student: ${updatedStudent.studentID}`);

    res.status(200).json(updatedStudent);
  } catch (error) {
    logger.error(`Error updating student: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      winston.warn(`Student not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: "Student not found" });
    }
    logger.info(`Deleted student: ${deletedStudent.studentID}`);

    res.status(200).json({ message: "Student deleted" });
  } catch (error) {
    logger.error(`Error deleting student: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Search students
exports.searchStudent = async (req, res) => {
  try {
    const { name, studentId, faculty } = req.query;
    let query = {};
    if (name) query.fullName = { $regex: name, $options: "i" };
    if (studentId) query.studentId = studentId;
    if (faculty) query.faculty = faculty;

    const students = await Student.find(query);
    logger.info(`Search performed with query: ${JSON.stringify(req.query)}`);
    res.status(200).json(students);
  } catch (error) {
    logger.error(`Error searching students: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};