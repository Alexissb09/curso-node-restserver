import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadAnyFile = (
  files,
  validExtensions = ["jpg", "png", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;

    // Take the extension of fileName
    const split = file.name.split(".");
    const extension = split[split.length - 1];

    if (!validExtensions.includes(extension)) {
      return reject(
        `The extension: .${extension} is not valid, must be: ${validExtensions}`
      );
    }

    const tempName = uuidv4() + "." + extension; // temporal name

    const uploadPath = path.join(
      __dirname,
      "../uploads/" + folder + "/" + tempName
    );

    // Move the file to uploads path
    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(tempName);
    });
  });
};
