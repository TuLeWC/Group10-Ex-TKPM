import Program from '../models/Program.js';
import logger from '../utils/logger.js';

// /api/programs

// Create Program
export const createProgram = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Program name is required' });
    }

    const normalizedName = name.trim().toLowerCase();

    const existingProgram = await Program.findOne({
      name: new RegExp(`^${normalizedName}$`, 'i'),
    });
    if (existingProgram) {
      return res.status(400).json({ message: 'Program already exists' });
    }

    const newProgram = new Program({ name });
    await newProgram.save();
    logger.info(`Program created: ${newProgram.name}`);

    res.status(201).json(newProgram);
  } catch (error) {
    logger.error(`Error creating program: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get all Programs
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find();
    logger.info('Fetched all programs');
    res.status(200).json(programs);
  } catch (error) {
    logger.error(`Error fetching programs: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Update Program Name
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
