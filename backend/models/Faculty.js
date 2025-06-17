import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: {
    vi: { type: String, required: true, unique: true },
    en: { type: String, required: true, unique: true },
  },
});

const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;
