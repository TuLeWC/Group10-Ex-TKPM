import { body } from 'express-validator';
import Faculty from '../models/Faculty.js';

// Validate faculty name
const validateFacultyName = [
  // Validate Vietnamese name
  body('name.vi')
    .trim()
    .notEmpty()
    .withMessage('Tên khoa tiếng Việt không được để trống'),

  // Validate English name
  body('name.en')
    .trim()
    .notEmpty()
    .withMessage('Tên khoa tiếng Anh không được để trống'),

  // Check for duplicate names
  body('name').custom(async (value) => {
    if (!value || !value.vi || !value.en) {
      return true; // Let the above validators handle empty values
    }

    // Check for duplicate Vietnamese name
    const existingFacultyVi = await Faculty.findOne({
      'name.vi': { $regex: new RegExp(`^${value.vi}$`, 'i') },
    });

    if (existingFacultyVi) {
      throw new Error('Tên khoa tiếng Việt đã tồn tại');
    }

    // Check for duplicate English name
    const existingFacultyEn = await Faculty.findOne({
      'name.en': { $regex: new RegExp(`^${value.en}$`, 'i') },
    });

    if (existingFacultyEn) {
      throw new Error('Tên khoa tiếng Anh đã tồn tại');
    }

    return true;
  }),
];

export const facultyValidator = validateFacultyName;
