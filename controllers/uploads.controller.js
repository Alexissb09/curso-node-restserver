import { uploadAnyFile } from "../helpers/uploadAnyFile.js";
import { User } from "../models/user.js";
import { Product } from "../models/product.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
cloudinary.config(process.env.CLOUDINARY_URL);

export const uploadFile = async (req, res) => {
  try {
    const name = await uploadAnyFile(req.files, undefined, "imgs");

    res.status(200).json({ name });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

export const showImage = async (req, res) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);

      if (!model) {
        return res.status(400).json({
          message: `The user with id: ${id} does not exist`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);

      if (!model) {
        return res.status(400).json({
          message: `The product with id: ${id} does not exist`,
        });
      }
      break;
    default:
      return res.status(500).json({ message: "Not validated in backend :(" });
  }

  if (model.img) {
    const imagePath = path.join(__dirname, "../uploads", collection, model.img);

    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }
  }

  const noImgPath = path.join(__dirname, "../assets/no-image.jpg");
  if (fs.existsSync(noImgPath)) {
    return res.sendFile(noImgPath);
  }
};

export const updateImageCloudinary = async (req, res) => {
  try {
    const { collection, id } = req.params;

    let model;
    console.log(model);

    switch (collection) {
      case "users":
        model = await User.findById(id);

        if (!model) {
          return res.status(400).json({
            message: `The user with id: ${id} does not exist`,
          });
        }
        break;

      case "products":
        model = await Product.findById(id);

        if (!model) {
          return res.status(400).json({
            message: `The product with id: ${id} does not exist`,
          });
        }
        break;
      default:
        return res.status(500).json({ message: "Not validated in backend :(" });
    }

    // Clean previous images
    if (model.img) {
      const nameArr = model.img.split("/");
      const name = nameArr[nameArr.length - 1];
      const [public_id] = name.split(".");

      cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    model.img = secure_url;

    await model.save();

    res.status(200).json({
      model,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};
