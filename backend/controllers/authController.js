import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "crypto";
import User from "../models/User.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export const signup = async (req, res) => {
  const { name, email, password, phone, rollNumber } = req.body;

  if (!name || !email || !password || !rollNumber) {
    return res.status(400).json({ message: "Name, email, password, and roll number are required" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { rollNumber: rollNumber.trim().toUpperCase() }] });
    if (existingUser) {
      return res.status(409).json({ message: "Email or roll number already exists" });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((item) => item.trim().toLowerCase());
    const isAdmin = adminEmails.includes(email.toLowerCase());
    const userCount = await User.countDocuments();

    const user = await User.create({
      name,
      email,
      rollNumber: rollNumber.trim().toUpperCase(),
      password,
      phone,
      isAdmin: userCount === 0 || isAdmin,
    });
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(" ");
      return res.status(400).json({ message });
    }
    return res.status(500).json({ message: "Server error while signing up" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while logging in" });
  }
};

export const getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  return res.status(200).json({ profile: req.user });
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    const resetToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(resetToken).digest("hex");

    user.resetToken = hashedToken;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

    const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;

    if (emailConfigured) {
      try {
        await sendPasswordResetEmail(email, resetToken, resetLink);
        return res.status(200).json({
          message: "Password reset link sent to your email",
        });
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
        if (process.env.NODE_ENV !== "production") {
          return res.status(200).json({
            message:
              "Password reset link generated but email delivery failed. Use the development link below.",
            resetLink,
          });
        }
        return res.status(500).json({
          message:
            "Unable to send password reset email. Please check the email configuration and try again.",
        });
      }
    }

    if (process.env.NODE_ENV === "production") {
      return res.status(500).json({
        message:
          "Email service is not configured. Set EMAIL_USER and EMAIL_PASSWORD in backend/.env to enable password reset.",
      });
    }

    console.warn("Email settings missing; returning reset link in response for development.");
    return res.status(200).json({
      message:
        "Password reset link generated. Configure email settings for real delivery or use the link provided.",
      resetLink,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while processing password reset" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ message: "Token and passwords are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const hashedToken = createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while resetting password" });
  }
};
