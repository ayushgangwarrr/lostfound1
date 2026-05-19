import User from "../models/User.js";
import Report from "../models/Report.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -resetToken -resetTokenExpiry").sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error fetching users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "Admins cannot delete themselves" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Report.deleteMany({ userId: user._id });
    await user.deleteOne();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error deleting user" });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("userId", "name email phone").sort({ createdAt: -1 });
    return res.status(200).json({ reports });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error fetching reports" });
  }
};
