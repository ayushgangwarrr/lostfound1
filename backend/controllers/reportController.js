import Report from "../models/Report.js";

export const createReport = async (req, res) => {
  const {
    type,
    itemName,
    description,
    personName,
    phone,
    location,
    dateLostOrFound,
    reward,
  } = req.body;

  if (!type || !itemName || !description || !phone || !location) {
    return res.status(400).json({ message: "Missing required report fields" });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image || "";

  try {
    const report = await Report.create({
      userId: req.user._id,
      type,
      itemName,
      description,
      personName,
      phone,
      image: imageUrl,
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
    const reports = await Report.find().populate("userId", "name email phone").sort({ createdAt: -1 });
    return res.status(200).json({ reports });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error fetching reports" });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate("userId", "name email phone");
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
    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this report" });
    }

    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
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
    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this report" });
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
    const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ reports });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error fetching user reports" });
  }
};
