import Report from "../models/Report.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";

const getCloudinaryFields = async (file) => {
  if (!file) return {};
  const uploadResult = await uploadImage(file);
  return {
    image: uploadResult.secure_url,
    imageId: uploadResult.public_id,
  };
};

export const createReport = async (req, res) => {
  const {
    type,
    itemName,
    description,
    personName,
    rollNumber,
    category,
    phone,
    location,
    dateLostOrFound,
    reward,
  } = req.body;

  if (!type || !itemName || !description || !phone || !location) {
    return res.status(400).json({ message: "Missing required report fields" });
  }

  try {
    const imageFields = req.file
      ? await getCloudinaryFields(req.file)
      : {
          image: req.body.image || "",
          imageId: "",
        };

    const report = await Report.create({
      userId: req.user._id,
      type,
      itemName,
      description,
      personName: personName || req.user.name,
      rollNumber: (rollNumber || req.user.rollNumber || "").toString().trim().toUpperCase(),
      category: category || "Other",
      phone,
      image: imageFields.image,
      imageId: imageFields.imageId,
      location,
      dateLostOrFound: dateLostOrFound ? new Date(dateLostOrFound) : Date.now(),
      reward,
    });

    return res.status(201).json({ message: "Report created", report });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error creating report" });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("userId", "name email phone rollNumber")
      .sort({ createdAt: -1 });
    return res.status(200).json({ reports });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error fetching reports" });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate("userId", "name email phone rollNumber");
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    return res.status(200).json({ report });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error fetching report" });
  }
};

export const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    if (report.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized to update this report" });
    }

    const updateData = {
      ...req.body,
      rollNumber: req.body.rollNumber ? req.body.rollNumber.toString().trim().toUpperCase() : report.rollNumber,
      category: req.body.category || report.category || "Other",
    };

    if (req.file) {
      if (report.imageId) {
        await deleteImage(report.imageId);
      }
      const imageFields = await getCloudinaryFields(req.file);
      updateData.image = imageFields.image;
      updateData.imageId = imageFields.imageId;
    }

    const updatedReport = await Report.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ message: "Report updated", report: updatedReport });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error updating report" });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    if (report.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized to delete this report" });
    }

    if (report.imageId) {
      await deleteImage(report.imageId);
    }
    await report.deleteOne();

    return res.status(200).json({ message: "Report deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error deleting report" });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .populate("userId", "name email phone rollNumber")
      .sort({ createdAt: -1 });
    return res.status(200).json({ reports });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error fetching user reports" });
  }
};
