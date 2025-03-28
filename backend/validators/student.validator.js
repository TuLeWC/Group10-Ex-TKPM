import { body } from 'express-validator';
import Student from '../models/Student.js';
import EmailConfig from '../models/EmailConfig.js';
import PhoneConfig from '../models/PhoneConfig.js';
import StatusTransitionConfig from '../models/StatusTransitionConfig.js';

// Validate Email
const validateEmail = body('email').custom(async (value) => {
  const emailDomain = value.split('@')[1];

  if (!emailDomain) {
    throw new Error('Email không hợp lệ');
  }

  // Nếu chưa cấu hình thì chấp nhận tất cả email
  const allowedDomains = await EmailConfig.find();

  if (allowedDomains.length === 0) {
    return true;
  }

  // Kiểm tra email hợp lệ
  const isAllowed = allowedDomains.some(
    (config) => config.domain === emailDomain
  );

  if (!isAllowed) {
    throw new Error('Email không thuộc tên miền được phép');
  }

  return true;
});

// Validate Phone number
const validatePhoneNumber = body('phoneNumber').custom(async (value) => {
  // Nếu chưa cấu hình thì chấp nhận tất cả sđt
  const phoneConfigs = await PhoneConfig.find();

  if (phoneConfigs.length === 0) {
    return true;
  }

  // Kiểm tra sđt hợp lệ
  const isValid = phoneConfigs.some(
    (config) =>
      config.regexPattern && new RegExp(config.regexPattern).test(value)
  );

  if (!isValid) {
    throw new Error('Số điện thoại không có định dạng hợp lệ');
  }

  return true;
});

// // Validate MSSV duy nhất
// const validateStudentId = body("studentId")
//   .notEmpty()
//   .withMessage("MSSV không được để trống")
//   .custom(async (value) => {
//     const student = await Student.findOne({ studentId: value });
//     if (student) {
//       throw new Error("MSSV đã tồn tại");
//     }
//     return true;
//   });

// Validate trạng thái sinh viên thay đổi hợp lệ
const validateStatusChange = body('studentStatus').custom(
  async (newStatusId, { req }) => {
    // Kiểm tra student tồn tại
    const student = await Student.findOne({
      studentId: req.params.id,
    }).populate('studentStatus');

    if (!student) {
      throw new Error('Không tìm thấy sinh viên');
    }

    const currentStatus = student.studentStatus._id;

    // Nếu chưa cấu hình thì chấp nhận mọi chuyển đổi
    const transitions = await StatusTransitionConfig.find();

    if (transitions.length === 0) {
      return true;
    }

    // Kiểm tra chuyển đổi hợp lệ
    const isValidTransition = transitions.some(
      (config) =>
        config.fromStatus.toString() === currentStatus.toString() &&
        config.toStatus.toString() === newStatusId.toString()
    );

    if (!isValidTransition) {
      throw new Error('Chuyển trạng thái không hợp lệ');
    }

    return true;
  }
);

export const studentValidator = [validateEmail, validatePhoneNumber];
export const statusValidator = [validateStatusChange];
