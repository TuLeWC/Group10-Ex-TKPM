const mongoose = require("mongoose");

const StudentStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học"],
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("StudentStatus", StudentStatusSchema);
