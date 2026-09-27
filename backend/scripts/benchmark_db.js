import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

dotenv.config();
if (process.env.NODE_ENV !== "production" && fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local", override: true });
}

const ITERATIONS = parseInt(process.env.DB_BENCH_ITERATIONS || "30", 10);
const BEFORE_FILE = path.resolve("db-benchmark-before.json");
const AFTER_FILE = path.resolve("db-benchmark-after.json");

const calculatePercentiles = (arr) => {
  if (!arr.length) return { mean: 0, p50: 0, p95: 0, p99: 0 };
  const sorted = [...arr].sort((a, b) => a - b);
  const mean = sorted.reduce((sum, val) => sum + val, 0) / sorted.length;
  const p50 = sorted[Math.floor(sorted.length * 0.5)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  return {
    mean: Number(mean.toFixed(2)),
    p50: Number(p50.toFixed(2)),
    p95: Number(p95.toFixed(2)),
    p99: Number(p99.toFixed(2)),
  };
};

const runBenchmark = async () => {
  await connectDB();

  console.log("==================================================");
  console.log("       DATABASE QUERY PERFORMANCE BENCHMARK       ");
  console.log("==================================================");

  // Retrieve existing fixtures to run deterministic queries
  const sampleUser = await User.findOne({ email: { $regex: /@benchmark\.local$/ } });
  const sampleConv = await Conversation.findOne();
  const sampleReceiverId = sampleConv?.participants?.[0] || sampleUser?._id;

  if (!sampleUser || !sampleConv) {
    console.error("Test fixtures not found! Run generate_test_data.js first.");
    process.exit(1);
  }

  const queries = [
    {
      name: "1. Global Item Feed (sort: createdAt DESC)",
      description: "Feed browsing: Report.find().sort({ createdAt: -1 }).limit(20)",
      targetCollection: "reports",
      explainFn: () => Report.find().sort({ createdAt: -1 }).limit(20).explain("executionStats"),
      runFn: () => Report.find().sort({ createdAt: -1 }).limit(20).lean(),
    },
    {
      name: "2. User's Item Reports (userId + sort createdAt)",
      description: "My reports: Report.find({ userId }).sort({ createdAt: -1 })",
      targetCollection: "reports",
      explainFn: () => Report.find({ userId: sampleUser._id }).sort({ createdAt: -1 }).explain("executionStats"),
      runFn: () => Report.find({ userId: sampleUser._id }).sort({ createdAt: -1 }).lean(),
    },
    {
      name: "3. Filtered Search (type + category + sort)",
      description: "Filter items: Report.find({ type: 'lost', category: 'Electronics' }).sort({ createdAt: -1 }).limit(20)",
      targetCollection: "reports",
      explainFn: () => Report.find({ type: "lost", category: "Electronics" }).sort({ createdAt: -1 }).limit(20).explain("executionStats"),
      runFn: () => Report.find({ type: "lost", category: "Electronics" }).sort({ createdAt: -1 }).limit(20).lean(),
    },
    {
      name: "4. Unread Messages Count (convId + receiverId + readStatus)",
      description: "Inbox badge count: Message.countDocuments({ conversationId, receiverId, readStatus: false })",
      targetCollection: "messages",
      explainFn: () => Message.find({ conversationId: sampleConv._id, receiverId: sampleReceiverId, readStatus: false }).explain("executionStats"),
      runFn: () => Message.countDocuments({ conversationId: sampleConv._id, receiverId: sampleReceiverId, readStatus: false }),
    },
    {
      name: "5. Mark Conversation Read (updateMany readStatus)",
      description: "Read receipts: Message.updateMany({ conversationId, receiverId, readStatus: false }, { readStatus: true })",
      targetCollection: "messages",
      explainFn: () => Message.find({ conversationId: sampleConv._id, receiverId: sampleReceiverId, readStatus: false }).explain("executionStats"),
      runFn: () => Message.updateMany({ conversationId: sampleConv._id, receiverId: sampleReceiverId, readStatus: false }, { readStatus: true }),
    },
    {
      name: "6. User Search by Name / Roll Number",
      description: "User search: User.find({ name: /^Bench/i }).limit(20)",
      targetCollection: "users",
      explainFn: () => User.find({ name: /^Bench/i }).limit(20).explain("executionStats"),
      runFn: () => User.find({ name: /^Bench/i }).limit(20).select("_id name rollNumber").lean(),
    },
  ];

  const results = {};

  for (const q of queries) {
    console.log(`\nBenchmarking: ${q.name}...`);
    
    // 1. Get MongoDB explain execution stats
    let stage = "UNKNOWN";
    let totalDocsExamined = 0;
    let nReturned = 0;
    let executionTimeMillis = 0;

    try {
      const explainRes = await q.explainFn();
      const stats = explainRes.executionStats || {};
      totalDocsExamined = stats.totalDocsExamined ?? 0;
      nReturned = stats.nReturned ?? 0;
      executionTimeMillis = stats.executionTimeMillis ?? 0;

      // Extract winning plan stage
      const winningPlan = explainRes.queryPlanner?.winningPlan || {};
      stage = winningPlan.stage || "UNKNOWN";
      if (winningPlan.inputStage) {
        stage = `${winningPlan.stage} -> ${winningPlan.inputStage.stage}`;
      }
    } catch (err) {
      console.warn(`Explain error on ${q.name}:`, err.message);
    }

    // 2. Measure timed iterations
    const latencies = [];
    for (let i = 0; i < ITERATIONS; i++) {
      const start = process.hrtime();
      await q.runFn();
      const diff = process.hrtime(start);
      const ms = diff[0] * 1000 + diff[1] / 1e6;
      latencies.push(ms);
    }

    const percentiles = calculatePercentiles(latencies);

    results[q.name] = {
      description: q.description,
      stage,
      totalDocsExamined,
      nReturned,
      serverExecutionTimeMillis: executionTimeMillis,
      latencies: percentiles,
    };

    console.log(`  Stage: ${stage} | Docs Examined: ${totalDocsExamined} | Returned: ${nReturned}`);
    console.log(`  Mean: ${percentiles.mean} ms | P50: ${percentiles.p50} ms | P95: ${percentiles.p95} ms | P99: ${percentiles.p99} ms`);
  }

  const saveBefore = process.argv.includes("--save-before");
  const saveAfter = process.argv.includes("--save-after");

  if (saveBefore) {
    fs.writeFileSync(BEFORE_FILE, JSON.stringify(results, null, 2));
    console.log(`\nSaved baseline metrics to: ${BEFORE_FILE}`);
  } else if (saveAfter) {
    fs.writeFileSync(AFTER_FILE, JSON.stringify(results, null, 2));
    console.log(`\nSaved optimized metrics to: ${AFTER_FILE}`);
  }

  // If both exist, display before/after comparison table
  if (fs.existsSync(BEFORE_FILE) && (saveAfter || fs.existsSync(AFTER_FILE))) {
    const beforeData = JSON.parse(fs.readFileSync(BEFORE_FILE));
    const afterData = saveAfter ? results : JSON.parse(fs.readFileSync(AFTER_FILE));

    console.log("\n==========================================================================================");
    console.log("                    BEFORE vs AFTER INDEXING COMPARISON TABLE                             ");
    console.log("==========================================================================================");
    console.log(
      "Query".padEnd(42) +
      "Docs Examined (B -> A)".padEnd(25) +
      "P95 Latency (B -> A)".padEnd(25) +
      "P95 Improvement"
    );
    console.log("-".repeat(105));

    for (const [key, after] of Object.entries(afterData)) {
      const before = beforeData[key];
      if (!before) continue;

      const docsBefore = before.totalDocsExamined;
      const docsAfter = after.totalDocsExamined;
      const p95Before = before.latencies.p95;
      const p95After = after.latencies.p95;

      const latencyImprovement = p95Before > 0 
        ? (((p95Before - p95After) / p95Before) * 100).toFixed(1) + "%"
        : "N/A";

      console.log(
        key.slice(0, 40).padEnd(42) +
        `${docsBefore} -> ${docsAfter}`.padEnd(25) +
        `${p95Before}ms -> ${p95After}ms`.padEnd(25) +
        latencyImprovement
      );
    }
    console.log("==========================================================================================\n");
  }

  await mongoose.disconnect();
};

runBenchmark().catch((err) => {
  console.error("Database benchmark failed:", err);
  process.exit(1);
});
