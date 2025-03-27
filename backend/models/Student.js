import mongoose from 'mongoose';
import EmailConfig from './EmailConfig.js';

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Nam', 'Nữ', 'Khác'], required: true },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true,
  },
  studentStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentStatus',
    required: true,
  },
  addresses: {
    permanent: {
      houseNumber: { type: String, required: true },
      street: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    temporary: {
      houseNumber: { type: String },
      street: { type: String },
      district: { type: String },
      city: { type: String },
      country: { type: String },
    },
    mailing: {
      houseNumber: { type: String, required: true },
      street: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  idDocument: { type: mongoose.Schema.Types.ObjectId, ref: 'IDDocument' },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (email) {
        const emailDomain = email.split('@')[1];
        if (!emailDomain) return false;

        const allowedDomains = await EmailConfig.find().distinct('domain');

        return allowedDomains.includes(emailDomain);
      },
      message: 'Email không thuộc domain được phép!',
    },
  },
  phoneNumber: { type: String, required: true, match: /^[0-9]{10,11}$/ },
  nationality: { type: String, required: true },
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
