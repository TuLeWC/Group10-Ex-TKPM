const express = require("express");
const router = express.Router();
const facultyController = require("../controller/falcultyController");

// Create a new faculty
router.post("/", facultyController.createFaculty);

// Get all faculties
router.get("/", facultyController.getAllFaculties);

// Update a faculty name
router.put("/:id", facultyController.updateFaculty);

// Delete a faculty
router.delete("/:id", facultyController.deleteFaculty);

module.exports = router;
