import { Router } from "express";
import { check } from "express-validator";
import { login } from "../controllers/auth.controller.js";
import { validateFields } from "../middlewares/validateFields.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  [
    check("email", "The email is required").isEmail(),
    check("password", "The password is required").notEmpty(),
    validateFields,
  ],
  login
);
