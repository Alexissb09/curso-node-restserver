import { Router } from "express";

import {
  getUser,
  postUser,
  deleteUser,
  putUser,
  patchUser,
} from "../controllers/user.controller.js";

export const router = Router();

router.get("/", getUser);

router.put("/:id", putUser);

router.post("/:id", postUser);

router.delete("/:id", deleteUser);

router.patch("/:id", patchUser);
