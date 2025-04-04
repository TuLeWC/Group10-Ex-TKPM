import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
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
        type: String,
        required: true,
    },
    prerequisites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        },
    ],
});

const Course = mongoose.model('Course', courseSchema);
export default Course;