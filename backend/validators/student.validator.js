import { body } from "express-validator";
import Student from "../models/Student.js";
import EmailConfig from "../models/EmailConfig.js";
import PhoneConfig from "../models/PhoneConfig.js";
import StatusTransitionConfig from "../models/StatusTransitionConfig.js";


// Validate Email
const validateEmail = body("email").custom(async (value) => {
  const emailDomain = value.split("@")[1];

  if (!emailDomain) {
    throw new Error("Email không hợp lệ");
  }

  const allowedDomain = await EmailConfig.findOne({ domain: emailDomain });

  if (!allowedDomain) {
    throw new Error("Email không thuộc tên miền được phép");
  }

  return true;
});



// Validate Phone number
const validatePhoneNumber = body("phoneNumber").custom(async (value) => {
  const phoneConfigs = await PhoneConfig.find();

  if (!phoneConfigs.length) {
    throw new Error("Chưa cấu hình định dạng số điện thoại hợp lệ");
  }

  const isValid = phoneConfigs.some((config) => new RegExp(config.regexPattern).test(value));

  if (!isValid) {
    throw new Error("Số điện thoại không có định dạng hợp lệ");
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
const validateStatusChange = body("studentStatus").custom(async (newStatusId, { req }) => {
    const student = await Student.findOne({ studentId: req.params.id }).populate("studentStatus");

    if (!student) {
      throw new Error("Không tìm thấy sinh viên");
    }
  
    const currentStatus = student.studentStatus._id;
  
    const isValidTransition = await StatusTransitionConfig.exists({
      fromStatus: currentStatus,
      toStatus: newStatusId,
    });
  
    if (!isValidTransition) {
      throw new Error("Chuyển trạng thái không hợp lệ");
    }
  
    return true;
  });
  

export const studentValidator = [validateEmail, validatePhoneNumber];
export const statusValidator = [validateStatusChange];
