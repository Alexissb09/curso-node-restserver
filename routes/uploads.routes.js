import { Router } from "express";
import { check } from "express-validator";

import { validateFields } from "../middlewares/validateFields.js";
import { validateFiles } from "../middlewares/validateFiles.js";

import {
  uploadFile,
  showImage,
  updateImageCloudinary,
} from "../controllers/uploads.controller.js";
import { collectionsAllowed } from "../helpers/dbValidators.js";

export const uploadsRouter = Router();

uploadsRouter.post("/", validateFiles, uploadFile);
uploadsRouter.put(
  "/:collection/:id",
  [
    check("id", "The id is not valid").isMongoId(),
    validateFiles,
    check("collection").custom((c) =>
      collectionsAllowed(c, ["users", "products"])
    ),
    validateFields,
  ],
  updateImageCloudinary
);

uploadsRouter.get(
  "/:collection/:id",
  [
    check("id", "The id is not valid").isMongoId(),
    check("collection").custom((c) =>
      collectionsAllowed(c, ["users", "products"])
    ),
    validateFields,
  ],
  showImage
);
