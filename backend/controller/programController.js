const Program = require("../models/Program");
const logger = require("../utils/logger");

// Create Program
exports.createProgram = async (req, res) => {
  try {
    const program = new Program(req.body);
    await program.save();
    logger.info(`Program created: ${program.name}`);
    res.status(201).json(program);
  } catch (error) {
    logger.error(`Error creating program: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get all Programs
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find();
    logger.info("Fetched all programs");
    res.status(200).json(programs);
  } catch (error) {
    logger.error(`Error fetching programs: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Update Program Name
exports.updateProgram = async (req, res) => {
  try {
    const updatedProgram = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProgram) {
      logger.warn(`Program with ID ${req.params.id} not found`);
      return res.status(404).json({ message: "Program not found" });
    }
    logger.info(`Program updated: ${updatedProgram.name}`);
    res.status(200).json(updatedProgram);
  } catch (error) {
    logger.error(`Error updating program: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Delete Program
exports.deleteProgram = async (req, res) => {
  try {
    const deletedProgram = await Program.findByIdAndDelete(req.params.id);
    if (!deletedProgram) {
      logger.warn(`Program with ID ${req.params.id} not found`);
      return res.status(404).json({ message: "Program not found" });
    }
    logger.info(`Program deleted: ${deletedProgram.name}`);
    res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting program: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
