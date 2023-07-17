import { Role } from "../models/role.js";
import { User } from "../models/user.js";

export const isValidRole = async (role = "") => {
  const roleExist = await Role.findOne({ role });

  if (!roleExist) {
    throw new Error(`The role ${role} is not registered in the database`);
  }
};

export const emailExist = async (email = "") => {
  const emailFound = await User.findOne({ email });

  if (emailFound) {
    throw new Error(`The email ${email} is already registered`);
  }
};

export const userExist = async (id) => {
  const userFound = await User.findById(id);

  if (!userFound) {
    throw new Error(`The id ${id} does not exist`);
  }
};
