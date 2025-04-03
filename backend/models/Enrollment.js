import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'completed'],
    default: 'active',
  },
  cancellationDate: {
    type: Date,
  },
  grade: {
    type: Number,
    min: 0,
    max: 10,
  },
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;
