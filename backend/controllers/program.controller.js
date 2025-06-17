import Program from '../models/Program.js';
import logger from '../utils/logger.js';
import { localizeObject } from '../utils/i18n/index.js';

// /api/programs

// Get all Programs
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().lean();
    logger.info('Fetched all programs');
    res.status(200).json(localizeObject(programs, req.lang));
  } catch (error) {
    logger.error(`Error fetching programs: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get Program by ID
export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).lean();
    if (!program) {
      logger.warn(`Program with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Program not found' });
    }
    logger.info(`Fetched program: ${program.name}`);
    res.status(200).json(localizeObject(program, req.lang));
  } catch (error) {
    logger.error(`Error fetching program: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Create Program
export const createProgram = async (req, res) => {
  try {
    const program = new Program(req.body);
    await program.save();
    logger.info(`Program created: ${program.name}`);
    res.status(201).json(program);
  } catch (error) {
    logger.error(`Error creating program: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Update Program
export const updateProgram = async (req, res) => {
  try {
    const updatedProgram = await Program.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProgram) {
      logger.warn(`Program with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Program not found' });
    }
    logger.info(`Program updated: ${updatedProgram.name}`);
    res.status(200).json(updatedProgram);
  } catch (error) {
    logger.error(`Error updating program: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Delete Program
export const deleteProgram = async (req, res) => {
  try {
    const deletedProgram = await Program.findByIdAndDelete(req.params.id);
    if (!deletedProgram) {
      logger.warn(`Program with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Program not found' });
    }
    logger.info(`Program deleted: ${deletedProgram.name}`);
    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting program: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
