import StudentStatus from '../models/StudentStatus.js';
import logger from '../utils/logger.js';
import { localizeObject } from '../utils/i18n/index.js';

// /api/student-statuses

// Get all Student Statuses
export const getAllStudentStatuses = async (req, res) => {
  try {
    const statuses = await StudentStatus.find().lean();
    logger.info('Fetched all student statuses');
    res.status(200).json(localizeObject(statuses, req.lang));
  } catch (error) {
    logger.error(`Error fetching student statuses: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get Student Status by ID
export const getStudentStatusById = async (req, res) => {
  try {
    const status = await StudentStatus.findById(req.params.id).lean();
    if (!status) {
      logger.warn(`Student status with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Student status not found' });
    }
    logger.info(`Fetched student status: ${status.status}`);
    res.status(200).json(localizeObject(status, req.lang));
  } catch (error) {
    logger.error(`Error fetching student status: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Create Student Status
export const createStudentStatus = async (req, res) => {
  try {
    const status = new StudentStatus(req.body);
    await status.save();
    logger.info(`Student status created: ${status.status}`);
    res.status(201).json(status);
  } catch (error) {
    logger.error(`Error creating student status: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Update Student Status
export const updateStudentStatus = async (req, res) => {
  try {
    const updatedStatus = await StudentStatus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStatus) {
      logger.warn(`Student status with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Student status not found' });
    }
    logger.info(`Student status updated: ${updatedStatus.status}`);
    res.status(200).json(updatedStatus);
  } catch (error) {
    logger.error(`Error updating student status: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Delete Student Status
export const deleteStudentStatus = async (req, res) => {
  try {
    const deletedStatus = await StudentStatus.findByIdAndDelete(req.params.id);
    if (!deletedStatus) {
      logger.warn(`Student status with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Student status not found' });
    }
    logger.info(`Student status deleted: ${deletedStatus.status}`);
    res.status(200).json({ message: 'Student status deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting student status: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};
