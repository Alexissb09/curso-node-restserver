import { Router } from "express";
import { check } from "express-validator";

import { validateFields } from "../middlewares/validateFields.js";
import { validateJWT } from "../middlewares/validateJWT.js";
import { isAdminRole, haveRole } from "../middlewares/validateRoles.js";

import { isValidRole, emailExist, userExist } from "../helpers/dbValidators.js";

import {
  getUser,
  postUser,
  deleteUser,
  putUser,
  patchUser,
} from "../controllers/user.controller.js";

export const router = Router();

router.get("/", getUser);

router.put(
  "/:id",
  [
    check("id", "The ID is not valid").isMongoId(),
    check("id").custom(userExist),
    check("role").custom(isValidRole),
    check("password", "The password must have more than 6 characters").isLength(
      { min: 6 }
    ),
    validateFields,
  ],
  putUser
);

router.post(
  "/",
  [
    check("name", "The name is required").notEmpty(),
    check("password", "The password must have more than 6 characters").isLength(
      { min: 6 }
    ),
    check("email", "The email is not valid").isEmail().custom(emailExist),
    // check("role", "The role is not valid").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("role").custom(isValidRole),
    validateFields,
  ],
  postUser
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    haveRole("ADMIN_ROLE"),
    check("id", "The ID is not valid").isMongoId(),
    check("id").custom(userExist),
    validateFields,
  ],
  deleteUser
);

router.patch("/:id", patchUser);
