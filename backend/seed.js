import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Faculty from './models/Faculty.js';
import StudentStatus from './models/StudentStatus.js';
import Program from './models/Program.js';
import EmailConfig from './models/EmailConfig.js';
import PhoneConfig from './models/PhoneConfig.js';
import StatusTransitionConfig from './models/StatusTransitionConfig.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ Error connecting to MongoDB:', err));

// Dữ liệu mẫu
const faculties = [
  { name: 'Khoa Luật' },
  { name: 'Khoa Tiếng Anh thương mại' },
  { name: 'Khoa Tiếng Nhật' },
  { name: 'Khoa Tiếng Pháp' },
];

const studentStatuses = [
  { status: 'Đang học' },
  { status: 'Đã tốt nghiệp' },
  { status: 'Đã thôi học' },
  { status: 'Tạm dừng học' },
];

const programs = [
  { name: 'Đại trà' },
  { name: 'Chất lượng cao' },
  { name: 'Tiên tiến' },
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
    await Faculty.deleteMany();
    await StudentStatus.deleteMany();
    await Program.deleteMany();
    await EmailConfig.deleteMany();
    await PhoneConfig.deleteMany();
    await StatusTransitionConfig.deleteMany();

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
    }

    console.log('✅ Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.log('❌ Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();
