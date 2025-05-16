import EmailConfig from '../models/EmailConfig.js';
import PhoneConfig from '../models/PhoneConfig.js';

export const seedTestData = async () => {
  // Seed email configurations
  await EmailConfig.insertMany([
    { domain: 'student.edu.vn' }
  ]);

  // Seed phone configurations
  await PhoneConfig.insertMany([
    {
      country: 'Vietnam',
      regexPattern: '^(\\+84|0)(3[2-9]|5[2689]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$'
    }
  ]);
}; 