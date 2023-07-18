import { response } from "express";
import { User } from "../models/user.js";
import bcryptjs from "bcryptjs";
import { generateJWT } from "../helpers/generateJWT.js";

export const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Verify email
    if (!user) {
      return res.status(400).json({
        message: "User / Password are not correct - email",
      });
    }

    // Verify status
    if (!user.state) {
      return res.status(400).json({
        message: "User / Password are not correct - state = false",
      });
    }

    // Verify password
    const validatePassword = bcryptjs.compareSync(password, user.password);

    if (!validatePassword) {
      return res.status(400).json({
        message: "User / Password are not correct - password",
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
