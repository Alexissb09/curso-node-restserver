import { response } from "express";
import { User } from "../models/user.js";
import bcryptjs from "bcryptjs";
import { generateJWT } from "../helpers/generateJWT.js";
import { googleVerify } from "../helpers/googleVerify.js";

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

export const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, img, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: ":P",
        img,
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    // If user in DB
    if (!user.state) {
      res.status(401).json({
        message: "User blocked, talk with an admin",
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
    res.status(400).json({
      ok: false,
      message: "The token can't be verified",
    });
  }
};
