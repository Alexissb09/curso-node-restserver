import { Router } from "express";
import { check } from "express-validator";
import { validateJWT } from "../middlewares/validateJWT.js";
import { validateFields } from "../middlewares/validateFields.js";
import { categoryExist } from "../helpers/dbValidators.js";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/categories.controller.js";

import { isAdminRole } from "../middlewares/validateRoles.js";

export const categoriesRouter = Router();

// All categories - public
categoriesRouter.get("/", getCategories);

// One category by id - public
categoriesRouter.get(
  "/:id",
  [check("id").isMongoId(), check("id").custom(categoryExist), validateFields],
  getCategory
);

// Create new category - private - only with token
categoriesRouter.post(
  "/",
  [
    validateJWT,
    check("name", "The name is required").notEmpty(),
    validateFields,
  ],
  createCategory
);

// Update category - private - only with token
categoriesRouter.put(
  "/:id",
  [
    validateJWT,
    check("id").isMongoId(),
    check("id").custom(categoryExist),
    check("name", "The name is required").notEmpty(),
    validateFields,
  ],
  updateCategory
);

// Delete category - private - only ADMIN
categoriesRouter.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id").isMongoId(),
    check("id").custom(categoryExist),
    validateFields,
  ],
  deleteCategory
);
