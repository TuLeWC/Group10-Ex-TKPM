import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
let isConnected = false;

export const connectInMemoryDB = async () => {
  if (isConnected) {
    return; // Đã kết nối, không cần kết nối lại
  }

  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Đảm bảo kết nối cũ được đóng đúng cách
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Thêm các tùy chọn kết nối để tăng độ ổn định
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4 // Force IPv4
    });
  
    isConnected = true;
    console.log('Connected to in-memory MongoDB');
  } catch (error) {
    console.error('Error connecting to in-memory MongoDB:', error);
    throw error;
  }
};

export const disconnectInMemoryDB = async () => {
  if (!isConnected) {
    return; // Không có kết nối nào để đóng
  }
  
  try {
    await mongoose.disconnect();
    
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }
    
    isConnected = false;
    console.log('Disconnected from in-memory MongoDB');
  } catch (error) {
    console.error('Error disconnecting from in-memory MongoDB:', error);
    throw error;
  }
};