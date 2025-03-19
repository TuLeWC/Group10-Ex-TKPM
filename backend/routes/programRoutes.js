const express = require("express");
const router = express.Router();
const programController = require("../controller/programController");

// Create a new program
router.post("/", programController.createProgram);

// Get all programs
router.get("/", programController.getAllPrograms);

// Update a program
router.put("/:id", programController.updateProgram);

// Delete a program
router.delete("/:id", programController.deleteProgram);

module.exports = router;
