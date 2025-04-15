import jwt from "jsonwebtoken";
import CustomError from "../utils/customeError";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new CustomError("Unauthorized", 401);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;