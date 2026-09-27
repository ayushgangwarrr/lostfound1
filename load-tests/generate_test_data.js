import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment from backend/.env and .env.local
const envPath = path.resolve(__dirname, "../backend/.env");
const envLocalPath = path.resolve(__dirname, "../backend/.env.local");
dotenv.config({ path: envPath });
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

const USERS_COUNT = parseInt(process.env.USERS || "200", 10);
const REPORTS_COUNT = parseInt(process.env.ITEMS || "1000", 10);
const CONVERSATIONS_COUNT = parseInt(process.env.CONVERSATIONS || "100", 10);
const MESSAGES_PER_CONV = parseInt(process.env.MESSAGES_PER_CONV || "20", 10);
const ISSUES_COUNT = parseInt(process.env.ISSUES || "50", 10);

const OUTPUT_FIXTURES = path.resolve(__dirname, "test-fixtures.json");

const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI not found in backend/.env");
  }
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB for data seeding");
};

// Define schemas inline or import to avoid circular dependency
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    rollNumber: { type: String, unique: true },
    password: String,
    phone: String,
    isAdmin: { type: Boolean, default: false },
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

const reportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["lost", "found"], required: true },
    itemName: { type: String, required: true },
    description: { type: String, required: true },
    personName: String,
    rollNumber: String,
    category: { type: String, default: "Other" },
    phone: String,
    image: String,
    imageId: String,
    location: String,
    dateLostOrFound: { type: Date, default: Date.now },
    reward: String,
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: String,
    lastMessageSender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    attachments: Array,
    messageType: { type: String, default: "text" },
    readStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const issueReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    description: String,
    category: String,
    reporterName: String,
    reporterEmail: String,
    status: { type: String, default: "open" },
  },
  { timestamps: true }
);

const User = mongoose.models.BenchUser || mongoose.model("User", userSchema);
const Report = mongoose.models.BenchReport || mongoose.model("Report", reportSchema);
const Conversation = mongoose.models.BenchConversation || mongoose.model("Conversation", conversationSchema);
const Message = mongoose.models.BenchMessage || mongoose.model("Message", messageSchema);
const IssueReport = mongoose.models.BenchIssue || mongoose.model("IssueReport", issueReportSchema);

const cleanTestData = async () => {
  console.log("Cleaning previously generated benchmark data...");
  const deletedReports = await Report.deleteMany({ itemName: { $regex: /^\[TEST-BENCH\]/ } });
  const deletedMessages = await Message.deleteMany({ text: { $regex: /^\[TEST-BENCH\]/ } });
  const deletedIssues = await IssueReport.deleteMany({ title: { $regex: /^\[TEST-BENCH\]/ } });
  const deletedUsers = await User.deleteMany({ email: { $regex: /@benchmark\.local$/ } });
  console.log(`Cleaned: ${deletedUsers.deletedCount} users, ${deletedReports.deletedCount} reports, ${deletedMessages.deletedCount} messages, ${deletedIssues.deletedCount} issues.`);
};

const generateData = async () => {
  await connectDB();

  const isClean = process.argv.includes("--clean");
  if (isClean) {
    await cleanTestData();
    if (!process.argv.includes("--seed")) {
      process.exit(0);
    }
  }

  // Pre-hash password once to prevent CPU saturation during seed
  console.log("Pre-hashing standard benchmark password...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Generate Users
  console.log(`Generating ${USERS_COUNT} benchmark users...`);
  const usersToInsert = [];
  for (let i = 1; i <= USERS_COUNT; i++) {
    const padded = String(i).padStart(5, "0");
    usersToInsert.push({
      name: `Bench User ${i}`,
      email: `bench_user_${padded}@benchmark.local`,
      rollNumber: `BNCH${padded}`,
      password: hashedPassword,
      phone: `99900${padded}`,
      isAdmin: i === 1,
    });
  }

  // Delete any existing test users to prevent duplicate key errors
  await User.deleteMany({ email: { $regex: /@benchmark\.local$/ } });
  const insertedUsers = await User.insertMany(usersToInsert);
  console.log(`Inserted ${insertedUsers.length} users.`);

  // Create JWT tokens for each test user
  const userFixtures = insertedUsers.map((u) => ({
    id: u._id.toString(),
    email: u.email,
    name: u.name,
    rollNumber: u.rollNumber,
    token: jwt.sign({ id: u._id.toString() }, JWT_SECRET, { expiresIn: "7d" }),
  }));

  // 2. Generate Reports
  console.log(`Generating ${REPORTS_COUNT} item reports...`);
  const categories = ["Electronics", "ID Cards & Keys", "Books & Stationery", "Bags & Wallets", "Clothing", "Other"];
  const locations = ["Library 1st Floor", "Student Center", "Computer Lab A", "Cafeteria", "Sports Complex", "Main Auditorium"];
  const types = ["lost", "found"];

  const reportsToInsert = [];
  for (let i = 1; i <= REPORTS_COUNT; i++) {
    const randomUser = insertedUsers[i % insertedUsers.length];
    const itemType = types[i % types.length];
    const category = categories[i % categories.length];
    const location = locations[i % locations.length];
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 3600000);

    reportsToInsert.push({
      userId: randomUser._id,
      type: itemType,
      itemName: `[TEST-BENCH] ${category} Item #${i}`,
      description: `Automated test report for ${category} found/lost near ${location}.`,
      personName: randomUser.name,
      rollNumber: randomUser.rollNumber,
      category,
      phone: randomUser.phone,
      location,
      dateLostOrFound: createdAt,
      reward: itemType === "lost" && i % 3 === 0 ? "$20" : "",
      createdAt,
      updatedAt: createdAt,
    });
  }

  await Report.deleteMany({ itemName: { $regex: /^\[TEST-BENCH\]/ } });
  const insertedReports = await Report.insertMany(reportsToInsert);
  console.log(`Inserted ${insertedReports.length} reports.`);

  // 3. Generate Conversations & Messages
  console.log(`Generating ${CONVERSATIONS_COUNT} conversations with ${MESSAGES_PER_CONV} messages each...`);
  const conversationsToInsert = [];
  const convPairs = [];

  for (let c = 0; c < CONVERSATIONS_COUNT; c++) {
    const userA = insertedUsers[c % insertedUsers.length];
    const userB = insertedUsers[(c + 1) % insertedUsers.length];
    conversationsToInsert.push({
      participants: [userA._id, userB._id],
      lastMessage: `[TEST-BENCH] Latest message in conversation ${c + 1}`,
      lastMessageSender: userA._id,
      lastMessageAt: new Date(),
    });
    convPairs.push({ userA, userB });
  }

  const insertedConversations = await Conversation.insertMany(conversationsToInsert);
  console.log(`Inserted ${insertedConversations.length} conversations.`);

  const messagesToInsert = [];
  for (let c = 0; c < insertedConversations.length; c++) {
    const conv = insertedConversations[c];
    const pair = convPairs[c];
    for (let m = 1; m <= MESSAGES_PER_CONV; m++) {
      const isSenderA = m % 2 === 1;
      const sender = isSenderA ? pair.userA : pair.userB;
      const receiver = isSenderA ? pair.userB : pair.userA;
      const isUnread = m > (MESSAGES_PER_CONV - 3); // last 3 messages unread
      messagesToInsert.push({
        conversationId: conv._id,
        senderId: sender._id,
        receiverId: receiver._id,
        text: `[TEST-BENCH] Message #${m} between ${sender.name} and ${receiver.name}`,
        messageType: "text",
        readStatus: !isUnread,
        createdAt: new Date(Date.now() - (MESSAGES_PER_CONV - m) * 60000),
      });
    }
  }

  await Message.deleteMany({ text: { $regex: /^\[TEST-BENCH\]/ } });
  const insertedMessages = await Message.insertMany(messagesToInsert);
  console.log(`Inserted ${insertedMessages.length} messages.`);

  // 4. Generate Issue Reports
  console.log(`Generating ${ISSUES_COUNT} issue reports...`);
  const issuesToInsert = [];
  for (let i = 1; i <= ISSUES_COUNT; i++) {
    const user = insertedUsers[i % insertedUsers.length];
    issuesToInsert.push({
      userId: user._id,
      title: `[TEST-BENCH] Issue #${i} - Feedback`,
      description: `Synthetic issue report for testing admin endpoints.`,
      category: "Support",
      reporterName: user.name,
      reporterEmail: user.email,
      status: i % 2 === 0 ? "open" : "closed",
    });
  }
  await IssueReport.deleteMany({ title: { $regex: /^\[TEST-BENCH\]/ } });
  await IssueReport.insertMany(issuesToInsert);
  console.log(`Inserted ${issuesToInsert.length} issues.`);

  // Write test fixtures for k6 and socket.io harness
  const fixtureData = {
    generatedAt: new Date().toISOString(),
    stats: {
      usersCount: insertedUsers.length,
      reportsCount: insertedReports.length,
      conversationsCount: insertedConversations.length,
      messagesCount: insertedMessages.length,
    },
    users: userFixtures,
    reports: insertedReports.slice(0, 100).map((r) => ({ id: r._id.toString(), type: r.type, category: r.category })),
    conversations: insertedConversations.slice(0, 50).map((c, idx) => ({
      id: c._id.toString(),
      userA: { id: convPairs[idx].userA._id.toString(), token: userFixtures.find((u) => u.id === convPairs[idx].userA._id.toString())?.token },
      userB: { id: convPairs[idx].userB._id.toString(), token: userFixtures.find((u) => u.id === convPairs[idx].userB._id.toString())?.token },
    })),
  };

  fs.writeFileSync(OUTPUT_FIXTURES, JSON.stringify(fixtureData, null, 2));
  console.log(`\nSuccessfully generated benchmark dataset! Fixtures written to: ${OUTPUT_FIXTURES}`);

  await mongoose.disconnect();
};

generateData().catch((err) => {
  console.error("Test data generation failed:", err);
  process.exit(1);
});
