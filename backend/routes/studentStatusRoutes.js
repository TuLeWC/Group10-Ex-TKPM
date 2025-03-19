const express = require("express");
const router = express.Router();
const studentStatusController = require("../controller/studentStatusController");

// Create a new student status
router.post("/", studentStatusController.createStudentStatus);

// Get all student statuses
router.get("/", studentStatusController.getAllStudentStatuses);

// Update a student status
router.put("/:id", studentStatusController.updateStudentStatus);

// Delete a student status
router.delete("/:id", studentStatusController.deleteStudentStatus);

module.exports = router;
