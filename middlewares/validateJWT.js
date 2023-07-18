import jwt from "jsonwebtoken";
import { request, response } from "express";
import { User } from "../models/user.js";

export const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({ message: "No token in request" });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Search user in db
    const userAuth = await User.findById(uid);

    // Verify if user exist in db
    if (!userAuth) {
      return res.status(401).json({
        message: "Invalid token - User not found in DB",
      });
    }

    // Verify status
    if (!userAuth.state) {
      return res.status(401).json({
        message: "Invalid token - User deleted",
      });
    }

    req.userAuth = userAuth;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }

  console.log(token);
};
