import { register, login } from "../controllers/authController";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

export default authRouter;