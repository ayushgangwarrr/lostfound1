import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const uploadsDir = path.resolve("uploads");
const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const uploadImage = async (file) => {
  if (!file?.buffer) {
    throw new Error("No file buffer provided for upload");
  }

  if (hasCloudinaryConfig) {
    try {
      return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "lostfound" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary upload failed:", cloudinaryError.message || cloudinaryError);
    }
  }

  await fs.promises.mkdir(uploadsDir, { recursive: true });
  const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
  const localPath = path.join(uploadsDir, safeName);
  await fs.promises.writeFile(localPath, file.buffer);
  return {
    secure_url: `/uploads/${safeName}`,
    public_id: `/uploads/${safeName}`,
  };
};

export const deleteImage = async (publicId) => {
  if (!publicId) return;

  if (publicId.startsWith("/uploads/")) {
    const filePath = path.join(uploadsDir, publicId.replace(/^\/uploads\//, ""));
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Local upload delete failed", error);
      }
    }
    return;
  }

  if (!hasCloudinaryConfig) return;

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    console.error("Cloudinary delete failed", error);
  }
};
