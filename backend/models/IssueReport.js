import mongoose from "mongoose";

const issueReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Issue title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Issue description is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Support", "Bug", "Content", "Feedback", "Other"],
      default: "Support",
      trim: true,
    },
    reporterName: {
      type: String,
      trim: true,
    },
    reporterEmail: {
      type: String,
      trim: true,
    },
    screenshot: {
      type: String,
      trim: true,
    },
    screenshotId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "in-review", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

const IssueReport = mongoose.model("IssueReport", issueReportSchema);
export default IssueReport;
