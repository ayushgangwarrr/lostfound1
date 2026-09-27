import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import * as metrics from "../metrics/metrics.js";

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

  // Record attempt and overall timing
  try { metrics.uploadsAttempt.inc(); } catch (e) {}
  const overallStart = process.hrtime();

  if (hasCloudinaryConfig) {
    const cStart = process.hrtime();
    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "lostfound" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      try {
        const cDiff = process.hrtime(cStart);
        const cSeconds = cDiff[0] + cDiff[1] / 1e9;
        metrics.cloudinaryUploadDuration.observe(cSeconds);

        const totalDiff = process.hrtime(overallStart);
        const totalSeconds = totalDiff[0] + totalDiff[1] / 1e9;
        metrics.uploadsSuccess.inc();
        metrics.uploadDuration.observe(totalSeconds);
      } catch (e) {}
      return result;
    } catch (cloudinaryError) {
      console.error("Cloudinary upload failed:", cloudinaryError.message || cloudinaryError);
      // Fall through to local fallback
    }
  }

  // Local fallback
  const fallbackStart = process.hrtime();
  await fs.promises.mkdir(uploadsDir, { recursive: true });
  const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
  const localPath = path.join(uploadsDir, safeName);
  await fs.promises.writeFile(localPath, file.buffer);
  try {
    const fDiff = process.hrtime(fallbackStart);
    const fSeconds = fDiff[0] + fDiff[1] / 1e9;
    metrics.localFallbackDuration.observe(fSeconds);

    const totalDiff = process.hrtime(overallStart);
    const totalSeconds = totalDiff[0] + totalDiff[1] / 1e9;
    metrics.uploadsFallback.inc();
    metrics.uploadDuration.observe(totalSeconds);
  } catch (e) {}
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
