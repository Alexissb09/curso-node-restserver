import { Schema, model } from "mongoose";

const UserSchema = Schema({
  name: { type: String, required: [true, "The name is required"] },
  email: {
    type: String,
    required: [true, "The email is required"],
    unique: true,
  },
  password: { type: String, required: [true, "The password is required"] },
  img: { type: String },
  role: { type: String, required: true, enum: ["ADMIN_ROLE", "USER_ROLE"] },
  state: { type: Boolean, default: true },
  google: { type: Boolean, default: false },
});

// Quitamos la version y password
UserSchema.methods.toJSON = function () {
  const { __v, password, ...user } = this.toObject();

  return user;
};

export const User = model("User", UserSchema);
