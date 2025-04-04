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
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  // Hạn cuối để huỷ học phần
  cancellationDeadline: {
    type: Date,
    required: true,
  },
});

const Semester = mongoose.model('Semester', semesterSchema);
export default Semester;
