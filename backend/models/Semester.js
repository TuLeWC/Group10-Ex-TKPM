import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema({
  semesterId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  startDay: {
    type: String, // VD: '01-08' (01 tháng 8)
    required: true,
    match: /^\d{2}-\d{2}$/, // kiểm tra định dạng 'dd-mm'
  },
  endDay: {
    type: String, // VD: '15-12'
    required: true,
    match: /^\d{2}-\d{2}$/,
  },
  cancellationDeadline: {
    type: String, // VD: '15-09'
    required: true,
    match: /^\d{2}-\d{2}$/,
  },
});

const Semester = mongoose.model('Semester', semesterSchema);
export default Semester;
