import Faculty from '../models/Faculty.js';
import logger from '../utils/logger.js';

// /api/faculties

// Create Faculty
export const createFaculty = async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    logger.info(`Faculty created: ${faculty.name}`);
    res.status(201).json(faculty);
  } catch (error) {
    logger.error(`Error creating faculty: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get all Faculties
export const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    logger.info('Fetched all faculties');
    res.status(200).json(faculties);
  } catch (error) {
    logger.error(`Error fetching faculties: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Update Faculty Name
export const updateFaculty = async (req, res) => {
  try {
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedFaculty) {
      logger.warn(`Faculty with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Faculty not found' });
    }
    logger.info(`Faculty updated: ${updatedFaculty.name}`);
    res.status(200).json(updatedFaculty);
  } catch (error) {
    logger.error(`Error updating faculty: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Delete Faculty
export const deleteFaculty = async (req, res) => {
  try {
    const deletedFaculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!deletedFaculty) {
      logger.warn(`Faculty with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Faculty not found' });
    }
    logger.info(`Faculty deleted: ${deletedFaculty.name}`);
    res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting faculty: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
