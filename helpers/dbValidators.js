import { Category } from "../models/category.js";
import { Product } from "../models/product.js";
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

export const categoryExist = async (id) => {
  const categoryFound = Category.findById(id);

  if (!categoryFound) {
    throw new Error(`The category with id ${id} is not registered on DB`);
  }
};

export const productExist = async (id) => {
  const productFound = await Product.findById(id);

  if (!productFound) {
    throw new Error(`The product with id ${id} is not registered in DB`);
  }
};

export const collectionsAllowed = async (c = "", collections = []) => {
  const isAllowed = collections.includes(c);

  if (!isAllowed) {
    throw new Error(
      `The collection ${c} is not allowed, must be: ${collections}`
    );
  }
  return true;
};
