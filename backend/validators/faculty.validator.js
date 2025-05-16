import { body } from 'express-validator';
import Faculty from '../models/Faculty.js';

// Validate faculty name
const validateFacultyName = body('name')
  .trim()
  .notEmpty()
  .withMessage('Tên khoa không được để trống')
  .custom(async (value) => {
    // Check for duplicate name (case-insensitive)
    const existingFaculty = await Faculty.findOne({
      name: { $regex: new RegExp(`^${value}$`, 'i') }
    });
    
    if (existingFaculty) {
      throw new Error('Tên khoa đã tồn tại');
    }
    
    return true;
  });

export const facultyValidator = [validateFacultyName]; 