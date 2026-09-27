import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    personName: {
      type: String,
      trim: true,
    },
    rollNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    category: {
      type: String,
      trim: true,
      default: "Other",
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    imageId: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    dateLostOrFound: {
      type: Date,
      default: Date.now,
    },
    reward: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance & scalability
// 1. Global Feed Sorting: avoids in-memory SORT stage and full collection scan
reportSchema.index({ createdAt: -1 });

// 2. User's Reports: ESR rule (Equality on userId, Sort on createdAt)
reportSchema.index({ userId: 1, createdAt: -1 });

// 3. Category & Type Filtered Queries: ESR rule (Equality on type & category, Sort on createdAt)
reportSchema.index({ type: 1, category: 1, createdAt: -1 });

const Report = mongoose.model("Report", reportSchema);
export default Report;
