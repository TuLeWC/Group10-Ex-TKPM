const express = require("express");
const { getAllStudents, createStudent, updateStudent, deleteStudent, searchStudent } = require("../controllers/studentController");
const { importCSV, exportCSV, importJSON, exportJSON } = require("../controllers/importExportController");

const router = express.Router();

router.get("/", getAllStudents);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.get("/search", searchStudent);

router.post("/import/csv", importCSV);
router.get("/export/csv", exportCSV);
router.post("/import/json", importJSON);
router.get("/export/json", exportJSON);

module.exports = router;
