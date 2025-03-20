import Student from '../models/Student.js';
import IDDocument from '../models/IDDocument.js';
import logger from '../utils/logger.js';

import csvParser from 'csv-parser';
import { Parser as Json2CsvParser } from 'json2csv';
import fs from 'fs';
// /api/students

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    logger.info(`Fetched all students`);
    res.status(200).json(students);
  } catch (error) {
    logger.error(`Error fetching students: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.id });
    if (!student) {
      logger.warn(`Student not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Student not found' });
    }
    logger.info(`Fetched student: ${student.studentId}`);
    res.status(200).json(student);
  } catch (error) {
    logger.error(`Error fetching student: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Create a student
export const createStudent = async (req, res) => {
  try {
    const { idDocument, ...studentData } = req.body;

    const newIDDocument = new IDDocument(idDocument);
    await newIDDocument.save();

    studentData.idDocument = newIDDocument._id;

    const student = new Student(studentData);
    await student.save();

    logger.info(`Student created: ${student.studentId}`);
    res.status(201).json(student);
  } catch (error) {
    logger.error(`Error creating student: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      req.body,
      { new: true }
    );

    if (!updatedStudent) {
      logger.warn(`Student not found for update: ${req.params.id}`);
      return res.status(404).json({ message: 'Student not found' });
    }
    logger.info(`Updated student: ${updatedStudent.studentId}`);

    res.status(200).json(updatedStudent);
  } catch (error) {
    logger.error(`Error updating student: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({
      studentId: req.params.id,
    });

    if (!deletedStudent) {
      logger.warn(`Student not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: 'Student not found' });
    }
    logger.info(`Deleted student: ${deletedStudent.studentId}`);

    res.status(200).json({ message: 'Student deleted' });
  } catch (error) {
    logger.error(`Error deleting student: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Search students
export const searchStudent = async (req, res) => {
  try {
    const { name, studentId, faculty } = req.query;
    let query = {};
    if (name) query.fullName = { $regex: name, $options: 'i' };
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

// Import and export to CSV
export const exportToCSV = async (req, res) => {
  try {
    const students = await Student.find().populate([
      'faculty',
      'program',
      'studentStatus',
      'idDocument',
    ]);
    const json2csvParser = new Json2CsvParser();
    const csv = json2csvParser.parse(students);

    logger.info('Export student data to CSV file');

    res.header('Content-Type', 'text/csv');
    res.attachment('students.csv');
    res.send(csv);
  } catch (error) {
    logger.error(`Error exporting student data to CSV file: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const importFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      logger.warn('There is no CSV file for import');
      return res.status(400).json({ error: 'No CSV file is uploaded' });
    }

    const students = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (row) => students.push(row))
      .on('end', async () => {
        await Student.insertMany(students);
        fs.unlinkSync(req.file.path);

        logger.info('Import from CSV file');

        res.json({ message: 'CSV imported successfully' });
      });
  } catch (error) {
    logger.error(
      `Error importing student data from CSV file: ${error.message}`
    );
    res.status(500).json({ error: error.message });
  }
};

// Import from JSON
export const importFromJSON = async (req, res) => {
  try {
    if (!req.file) {
      logger.warn('No JSON file uploaded');
      return res.status(400).json({ error: 'No JSON file uploaded' });
    }

    const jsonData = fs.readFileSync(req.file.path, 'utf-8');
    const students = JSON.parse(jsonData);

    await Student.insertMany(students);

    fs.unlinkSync(req.file.path);

    logger.info(`Imported ${students.length} students from JSON`);
    res.json({ message: `Imported ${students.length} students successfully` });
  } catch (error) {
    logger.error(
      `Error importing student data from JSON file: ${error.message}`
    );
    res.status(500).json({ error: error.message });
  }
};
