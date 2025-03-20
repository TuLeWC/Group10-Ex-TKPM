import mongoose from 'mongoose';

const studentStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    unique: true,
  },
});

const StudentStatus = mongoose.model('StudentStatus', studentStatusSchema);

export default StudentStatus;
