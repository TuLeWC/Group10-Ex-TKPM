import Student from '../models/Student.js';
import IDDocument from '../models/IDDocument.js';
import logger from '../utils/logger.js';
import { localizeObject } from '../utils/i18n/index.js';

import csvParser from 'csv-parser';
import { Parser as Json2CsvParser } from 'json2csv';
import fs from 'fs';

// /api/students

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('faculty') // get all info of faculty
      .populate('program') // get all info of program
      .populate('studentStatus') // get all info of studentStatus;
      .populate('idDocument') // get all info of idDocument;
      .lean();

    logger.info(`Fetched all students`);
    res.status(200).json(localizeObject(students, req.lang));
  } catch (error) {
    logger.error(`Error fetching students: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.id })
      .populate('faculty') // get all info of faculty
      .populate('program') // get all info of program
      .populate('studentStatus') // get all info of studentStatus;
      .populate('idDocument') // get all info of idDocument;
      .lean();

    if (!student) {
      logger.warn(`Student not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Student not found' });
    }
    logger.info(`Fetched student: ${student.studentId}`);
    res.status(200).json(localizeObject(student, req.lang));
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
    await student.populate('faculty');

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
    const student = await Student.findOne({ studentId: req.params.id });
    if (!student) {
      logger.warn(`Student not found for update: ${req.params.id}`);
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.body.idDocument) {
      await IDDocument.findByIdAndUpdate(
        student.idDocument,
        req.body.idDocument
      );
      delete req.body.idDocument;
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      req.body,
      { new: true }
    ).populate('idDocument');

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
