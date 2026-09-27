import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

dotenv.config();

const OUTPUT = path.resolve("perf-summary.json");

const fetchMetrics = async (baseUrl) => {
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/metrics`);
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    return null;
  }
};

const main = async () => {
  await connectDB();

  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

  const users = await User.countDocuments();
  const reports = await Report.countDocuments();
  // If status exists, count recovered
  const recovered = await (async () => {
    try {
      return await Report.countDocuments({ status: "recovered" });
    } catch (e) {
      return null;
    }
  })();
  const messages = await Message.countDocuments();
  const unreadMessages = await Message.countDocuments({ readStatus: false });
  const conversations = await Conversation.countDocuments();

  const metricsText = await fetchMetrics(baseUrl);

  const summary = {
    timestamp: new Date().toISOString(),
    baseUrl,
    counts: { users, reports, recovered, conversations, messages, unreadMessages },
    metricsText: metricsText || "metrics unavailable",
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(summary, null, 2));
  console.log(`Wrote ${OUTPUT}`);
  process.exit(0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
