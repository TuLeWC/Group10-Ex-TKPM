import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  name: {
    vi: { type: String, required: true, unique: true },
    en: { type: String, required: true, unique: true },
  },
});

const Program = mongoose.model('Program', programSchema);

export default Program;
