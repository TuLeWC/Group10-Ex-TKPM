import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      vi: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    },
    credits: {
      type: Number,
      required: true,
      min: [2, 'Credits must be at least 2'],
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
    description: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
    prerequisites: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
      ],
      default: [],
    },
    // Is the course active or inactive?
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
