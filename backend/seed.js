import mongoose from 'mongoose';
import Faculty from './models/Faculty.js';
import StudentStatus from './models/StudentStatus.js';
import Program from './models/Program.js';
import dotenv from 'dotenv';

dotenv.config(); // Nếu bạn dùng biến môi trường

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

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

// Hàm chèn dữ liệu
const seedDatabase = async () => {
  try {
    // Xóa dữ liệu cũ nếu có
    await Faculty.deleteMany();
    await StudentStatus.deleteMany();
    await Program.deleteMany();

    // Chèn dữ liệu mới
    await Faculty.insertMany(faculties);
    await StudentStatus.insertMany(studentStatuses);
    await Program.insertMany(programs);

    console.log('✅ Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.log('❌ Error seeding database:', error);
    mongoose.connection.close();
  }
};

// Chạy seed
seedDatabase();
