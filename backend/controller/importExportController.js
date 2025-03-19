const Student = require("../models/Student");
const csv = require("csv-parser");
const { Parser } = require("json2csv");
const fs = require("fs");

// Import CSV
exports.importCSV = async (req, res) => {
  const students = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => students.push(row))
    .on("end", async () => {
      await Student.insertMany(students);
      res.status(200).json({ message: "CSV imported successfully" });
    });
};

// Export CSV
exports.exportCSV = async (req, res) => {
  const students = await Student.find();
  const json2csvParser = new Parser();
  const csvData = json2csvParser.parse(students);
  res.header("Content-Type", "text/csv");
  res.attachment("students.csv");
  res.send(csvData);
};

// Import JSON
exports.importJSON = async (req, res) => {
  const students = req.body;
  await Student.insertMany(students);
  res.status(200).json({ message: "JSON imported successfully" });
};

// Export JSON
exports.exportJSON = async (req, res) => {
  const students = await Student.find();
  res.status(200).json(students);
};
