import { Router } from "express";
import { check } from "express-validator";
import { validateJWT } from "../middlewares/validateJWT.js";
import { validateFields } from "../middlewares/validateFields.js";
import { productExist } from "../helpers/dbValidators.js";

import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/products.controller.js";
import { isAdminRole } from "../middlewares/validateRoles.js";

export const productsRouter = Router();

productsRouter.post(
  "/",
  [
    validateJWT,
    check("name", "The name is required").notEmpty(),
    check("category", "The category is required").notEmpty(),
    validateFields,
  ],
  createProduct
);
productsRouter.get("/", [validateJWT], getProducts);
productsRouter.get(
  "/:id",
  [
    validateJWT,
    check("id").isMongoId(),
    check("id").custom(productExist),
    validateFields,
  ],
  getProduct
);

productsRouter.put(
  "/:id",
  [
    validateJWT,
    check("id").isMongoId(),
    check("id").custom(productExist),
    validateFields,
  ],
  updateProduct
);

productsRouter.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id").isMongoId(),
    check("id").custom(productExist),
    validateFields,
  ],
  deleteProduct
);
