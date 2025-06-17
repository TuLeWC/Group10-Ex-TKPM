import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Faculty from './models/Faculty.js';
import StudentStatus from './models/StudentStatus.js';
import Program from './models/Program.js';
import EmailConfig from './models/EmailConfig.js';
import PhoneConfig from './models/PhoneConfig.js';
import StatusTransitionConfig from './models/StatusTransitionConfig.js';
import Semester from './models/Semester.js';
import Course from './models/Course.js';
import Class from './models/Class.js';
import Enrollment from './models/Enrollment.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ Error connecting to MongoDB:', err));

// Dữ liệu mẫu
const faculties = [
  { name: { vi: 'Khoa Luật', en: 'Faculty of Law' } },
  {
    name: {
      vi: 'Khoa Tiếng Anh thương mại',
      en: 'Faculty of English for Business',
    },
  },
  { name: { vi: 'Khoa Tiếng Nhật', en: 'Faculty of Japanese' } },
  { name: { vi: 'Khoa Tiếng Pháp', en: 'Faculty of French' } },
];

const studentStatuses = [
  { status: { vi: 'Đang học', en: 'Studying' } },
  { status: { vi: 'Đã tốt nghiệp', en: 'Graduated' } },
  { status: { vi: 'Đã thôi học', en: 'Dropped Out' } },
  { status: { vi: 'Tạm dừng học', en: 'On Hold' } },
];

const programs = [
  { name: { vi: 'Đại trà', en: 'General' } },
  { name: { vi: 'Chất lượng cao', en: 'High Quality' } },
  { name: { vi: 'Tiên tiến', en: 'Advanced' } },
];

const emailConfigs = [
  { domain: 'example.edu.vn' },
  { domain: 'university.edu.vn' },
  { domain: 'student.university.edu.vn' },
];

const phoneConfigs = [
  {
    country: 'Vietnam',
    regexPattern: '^(\\+84|0)(3[2-9]|5[2689]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$',
  },
  { country: 'USA', regexPattern: '^(\\+1|1)?[0-9]{10}$' },
  { country: 'UK', regexPattern: '^(\\+44|0)7[0-9]{9}$' },
];

const seedDatabase = async () => {
  try {
    // Xóa dữ liệu cũ trước khi thêm dữ liệu mới
    await Faculty.deleteMany();
    await StudentStatus.deleteMany();
    await Program.deleteMany();
    await EmailConfig.deleteMany();
    await PhoneConfig.deleteMany();
    await StatusTransitionConfig.deleteMany();

    await Semester.deleteMany();
    await Course.deleteMany();
    await Class.deleteMany();
    await Enrollment.deleteMany();

    await Faculty.insertMany(faculties);
    await Program.insertMany(programs);
    await EmailConfig.insertMany(emailConfigs);
    await PhoneConfig.insertMany(phoneConfigs);

    const insertedStatuses = await StudentStatus.insertMany(studentStatuses);

    if (insertedStatuses.length >= 2) {
      let statusTransitions = [];

      insertedStatuses.forEach((status) => {
        // Trạng thái giữ nguyên
        statusTransitions.push({
          fromStatus: status._id,
          toStatus: status._id,
        });
      });

      statusTransitions = statusTransitions.concat([
        {
          fromStatus: insertedStatuses[0]._id, // Đang học
          toStatus: insertedStatuses[1]._id, // Đã tốt nghiệp
        },
        {
          fromStatus: insertedStatuses[0]._id, // Đang học
          toStatus: insertedStatuses[2]._id, // Đã thôi học
        },
        {
          fromStatus: insertedStatuses[0]._id, // Đang học
          toStatus: insertedStatuses[3]._id, // Tạm dừng học
        },
        {
          fromStatus: insertedStatuses[3]._id, // Tạm dừng học
          toStatus: insertedStatuses[0]._id, // Đang học
        },
      ]);

      await StatusTransitionConfig.insertMany(statusTransitions);

      // Thêm các thông tin liên quan đến khoá học
      const faculty = await Faculty.findOne();

      if (faculty) {
        // Thêm 3 học kỳ cho năm học 2025
        const semesters = await Semester.insertMany([
          {
            semesterId: 'HKI',
            name: { vi: 'Học kỳ I', en: 'Semester I' },
            startDay: '01-08',
            endDay: '15-12',
            cancellationDeadline: '15-09',
          },
          {
            semesterId: 'HKII',
            name: { vi: 'Học kỳ II', en: 'Semester II' },
            startDay: '01-01',
            endDay: '15-05',
            cancellationDeadline: '15-02',
          },
          {
            semesterId: 'HKIII',
            name: { vi: 'Học kỳ Hè', en: 'Summer Semester' },
            startDay: '01-06',
            endDay: '30-07',
            cancellationDeadline: '15-06',
          },
        ]);

        // Thêm khóa học
        const course1 = await Course.create({
          courseId: 'LAW101',
          name: { vi: 'Pháp luật đại cương', en: 'General Law' },
          credits: 3,
          faculty: faculty._id,
          description: {
            vi: 'Giới thiệu cơ bản về hệ thống pháp luật Việt Nam.',
            en: 'Introduction to the legal system of Vietnam.',
          },
        });

        const course2 = await Course.create({
          courseId: 'LAW201',
          name: { vi: 'Luật dân sự', en: 'Civil Law' },
          credits: 3,
          faculty: faculty._id,
          description: {
            vi: 'Nội dung luật dân sự Việt Nam.',
            en: 'Contents of Vietnamese civil law.',
          },
          prerequisites: [course1._id],
        });

        // Thêm lớp học
        await Class.create({
          classId: 'LAW101-01',
          course: course1._id,
          academicYear: 2026,
          semester: semesters[0]._id,
          lecturer: 'Nguyễn Văn A',
          maximumCapacity: 50,
          currentCapacity: 0,
          schedule: 'Thứ 2 - Tiết 1,2,3',
          classroom: 'A101',
        });
      }
    }

    console.log('✅ Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.log('❌ Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();
