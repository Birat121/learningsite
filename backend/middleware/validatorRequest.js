import { validationResult } from "express-validator";
import CustomError from "../utils/customeError.js";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return next(new CustomError(firstError.msg, 400));
  }

  next();
};

export default validateRequest;
