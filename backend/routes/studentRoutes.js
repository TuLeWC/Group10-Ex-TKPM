const express = require("express");
const { getAllStudents, createStudent, updateStudent, deleteStudent, searchStudent } = require("../controllers/studentController");

const router = express.Router();

router.get("/", getAllStudents);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.get("/search", searchStudent);

module.exports = router;
