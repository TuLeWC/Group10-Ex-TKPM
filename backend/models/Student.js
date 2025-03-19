const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Nam", "Nữ", "Khác"], required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    studentStatus: { type: mongoose.Schema.Types.ObjectId, ref: "StudentStatus", required: true },
    addresses: {
        permanent: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
        temporary: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
        mailing: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    },
    idDocument: { type: mongoose.Schema.Types.ObjectId, ref: "IDDocument" },
    email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ },
    phoneNumber: { type: String, required: true, match: /^[0-9]{10,11}$/ },
    nationality: { type: String, required: true },
    //   studentId: { type: String, required: true, unique: true },
    //   fullName: { type: String, required: true },
    //   dob: { type: Date, required: true },
    //   gender: { type: String, enum: ["Nam", "Nữ"], required: true },
    //   faculty: { type: String, enum: ["Khoa Luật", "Khoa Tiếng Anh thương mại", "Khoa Tiếng Nhật", "Khoa Tiếng Pháp"], required: true },
    //   program: { type: String, required: true },
    //   phone: { type: String, required: true },
    //   email: { type: String, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
    //   status: { type: String, enum: ["Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học"], required: true },
});

module.exports = mongoose.model("Student", studentSchema);
