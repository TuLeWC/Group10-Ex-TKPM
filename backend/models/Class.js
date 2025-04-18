import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  classId: {
    type: String,
    required: true,
    unique: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  academicYear: {
    type: Number,
    required: true,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true,
  },
  lecturer: {
    type: String,
    required: true,
  },
  maximumCapacity: {
    type: Number,
    required: true,
  },
  currentCapacity: {
    type: Number,
    default: 0,
  },
  schedule: {
    type: String,
    required: true,
  },
  classroom: {
    type: String,
    required: true,
  },
});

const Class = mongoose.model('Class', classSchema);
export default Class;
