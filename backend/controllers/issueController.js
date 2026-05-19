import IssueReport from "../models/IssueReport.js";
import { uploadImage } from "../utils/cloudinary.js";

const uploadScreenshot = async (file) => {
  if (!file) return {};
  const uploadResult = await uploadImage(file);
  return {
    screenshot: uploadResult.secure_url,
    screenshotId: uploadResult.public_id,
  };
};

export const createIssueReport = async (req, res) => {
  try {
    const { title, description, category, reporterName, reporterEmail } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    const screenshotFields = await uploadScreenshot(req.file);

    const issue = await IssueReport.create({
      title,
      description,
      category: category || "Support",
      reporterName: reporterName?.trim() || (req.user?.name ?? ""),
      reporterEmail: reporterEmail?.trim() || (req.user?.email ?? ""),
      userId: req.user?._id,
      ...screenshotFields,
    });

    return res.status(201).json({ issue, message: "Issue report submitted successfully." });
  } catch (error) {
    console.error("Issue report creation failed", error);
    return res.status(500).json({ message: "Unable to submit issue report." });
  }
};
