import { validationResult } from 'express-validator';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format the first error message
    const firstError = errors.array()[0];
    return res.status(400).json({ 
      message: firstError.msg 
    });
  }
  next();
};

export default validateRequest;
