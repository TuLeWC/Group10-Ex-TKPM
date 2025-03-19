const mongoose = require("mongoose");

const StudentStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("StudentStatus", StudentStatusSchema);
