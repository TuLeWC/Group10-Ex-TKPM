import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const Program = mongoose.model('Program', programSchema);

export default Program;
