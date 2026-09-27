import { io } from "socket.io-client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURES_PATH = path.resolve(__dirname, "../test-fixtures.json");
const WS_URL = process.env.WS_URL || "http://localhost:5001";
const TARGET_CONNECTIONS = parseInt(process.env.CONNECTIONS || "50", 10);
const DURATION_SECONDS = parseInt(process.env.DURATION || "15", 10);
const MESSAGE_INTERVAL_MS = parseInt(process.env.INTERVAL || "100", 10);

const calculatePercentiles = (arr) => {
  if (!arr.length) return { p50: 0, p95: 0, p99: 0, mean: 0 };
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
  if (!fs.existsSync(FIXTURES_PATH)) {
    console.error(`Fixtures file not found at ${FIXTURES_PATH}. Run generate_test_data.js first.`);
    process.exit(1);
  }

  const fixtures = JSON.parse(fs.readFileSync(FIXTURES_PATH, "utf8"));
  const conversations = fixtures.conversations || [];
  if (!conversations.length) {
    console.error("No conversation fixtures available. Re-run generate_test_data.js.");
    process.exit(1);
  }

  console.log("==================================================");
  console.log(`  SOCKET.IO REAL-TIME MESSAGING BENCHMARK (${TARGET_CONNECTIONS} CONNS) `);
  console.log("==================================================");
  console.log(`Target URL:           ${WS_URL}`);
  console.log(`Target Connections:   ${TARGET_CONNECTIONS}`);
  console.log(`Test Duration:        ${DURATION_SECONDS} seconds`);
  console.log(`Available Convs:      ${conversations.length}\n`);

  let connectionAttempts = 0;
  let connectionSuccess = 0;
  let connectionFailures = 0;
  let disconnects = 0;

  const serverProcessingLatencies = []; // Time for server to validate, write to MongoDB, and emit
  const endToEndDeliveryLatencies = [];  // Time from client sender emit to client recipient receipt
  let messagesSent = 0;
  let messagesAcked = 0;
  let messagesDelivered = 0;
  let readReceiptsEmitted = 0;
  let typingEventsEmitted = 0;

  const clients = [];

  // 1. Establish connections
  console.log(`Establishing ${TARGET_CONNECTIONS} concurrent WebSocket connections...`);
  const connStartTime = Date.now();

  const connectPromises = [];
  const halfConns = Math.floor(TARGET_CONNECTIONS / 2);

  for (let i = 0; i < halfConns; i++) {
    const conv = conversations[i % conversations.length];
    const userA = conv.userA;
    const userB = conv.userB;

    if (!userA?.token || !userB?.token) continue;

    // Connect User A
    const connectUser = (token, role, partnerId) => {
      connectionAttempts++;
      return new Promise((resolve) => {
        const socket = io(WS_URL, {
          auth: { token },
          extraHeaders: { cookie: `token=${token}` },
          transports: ["websocket"],
          reconnection: false,
          timeout: 5000,
        });

        const clientMeta = {
          socket,
          role,
          conversationId: conv.id,
          partnerId,
          connected: false,
        };

        socket.on("connect", () => {
          clientMeta.connected = true;
          connectionSuccess++;
          socket.emit("joinConversation", { conversationId: conv.id });
          resolve(clientMeta);
        });

        socket.on("connect_error", (_err) => {
          connectionFailures++;
          resolve(null);
        });

        socket.on("disconnect", () => {
          if (clientMeta.connected) {
            disconnects++;
          }
        });

        // Recipient listener
        socket.on("receiveMessage", (payload) => {
          messagesDelivered++;
          if (payload.clientTimestamp) {
            const e2e = Date.now() - payload.clientTimestamp;
            endToEndDeliveryLatencies.push(e2e);
          }
          // Emit read receipt & delivery ack
          socket.emit("messageSeen", { conversationId: conv.id });
          readReceiptsEmitted++;
          socket.emit("messageDeliveredReceipt", { clientSendTimestamp: payload.clientTimestamp });
        });

        socket.on("typing", () => {});
        socket.on("stopTyping", () => {});
      });
    };

    connectPromises.push(connectUser(userA.token, "sender", userB.id));
    connectPromises.push(connectUser(userB.token, "receiver", userA.id));
  }

  const results = await Promise.all(connectPromises);
  const activeClients = results.filter(Boolean);
  const connDuration = (Date.now() - connStartTime) / 1000;

  console.log(`Connection Setup Complete:`);
  console.log(`  Attempts:   ${connectionAttempts}`);
  console.log(`  Connected:  ${connectionSuccess} (${((connectionSuccess / Math.max(connectionAttempts, 1)) * 100).toFixed(1)}%)`);
  console.log(`  Failed:     ${connectionFailures}`);
  console.log(`  Setup Time: ${connDuration.toFixed(2)}s\n`);

  if (activeClients.length < 2) {
    console.error("Insufficient active connections to execute benchmark.");
    activeClients.forEach((c) => c.socket.close());
    process.exit(1);
  }

  // 2. Messaging loop
  console.log(`Running real-time messaging load for ${DURATION_SECONDS} seconds...`);
  const benchmarkStartTime = Date.now();
  const senders = activeClients.filter((c) => c.role === "sender");

  const messagingInterval = setInterval(() => {
    if (Date.now() - benchmarkStartTime > DURATION_SECONDS * 1000) {
      clearInterval(messagingInterval);
      return;
    }

    // Pick random sender
    const sender = senders[Math.floor(Math.random() * senders.length)];
    if (!sender || !sender.socket.connected) return;

    // Trigger typing event occasionally
    if (Math.random() < 0.2) {
      sender.socket.emit("typing", { conversationId: sender.conversationId });
      typingEventsEmitted++;
      setTimeout(() => {
        if (sender.socket.connected) {
          sender.socket.emit("stopTyping", { conversationId: sender.conversationId });
        }
      }, 500);
    }

    const clientTimestamp = Date.now();
    messagesSent++;

    sender.socket.emit(
      "sendMessage",
      {
        conversationId: sender.conversationId,
        text: `[BENCHMARK] Msg ${messagesSent} at ${clientTimestamp}`,
        clientTimestamp,
      },
      (ack) => {
        if (ack && ack.status === "ok") {
          messagesAcked++;
          if (ack.serverProcessingMs) {
            serverProcessingLatencies.push(parseFloat(ack.serverProcessingMs));
          }
        }
      }
    );
  }, MESSAGE_INTERVAL_MS);

  // Wait for test duration + 3 seconds drain time
  await new Promise((resolve) => setTimeout(resolve, (DURATION_SECONDS + 3) * 1000));

  const totalTestDuration = (Date.now() - benchmarkStartTime) / 1000;
  const messagesPerSec = (messagesDelivered / totalTestDuration).toFixed(2);

  const serverLatencyStats = calculatePercentiles(serverProcessingLatencies);
  const e2eLatencyStats = calculatePercentiles(endToEndDeliveryLatencies);

  console.log("\n==================================================");
  console.log("             SOCKET.IO BENCHMARK RESULTS          ");
  console.log("==================================================");
  console.log(`Active Connections:       ${activeClients.length}`);
  console.log(`Connection Success Rate:  ${((connectionSuccess / Math.max(connectionAttempts, 1)) * 100).toFixed(2)}%`);
  console.log(`Unexpected Disconnects:   ${disconnects}`);
  console.log(`Messages Sent:            ${messagesSent}`);
  console.log(`Messages Acked by Server: ${messagesAcked}`);
  console.log(`Messages Delivered to Rx: ${messagesDelivered}`);
  console.log(`Throughput (Msg/sec):     ${messagesPerSec}`);
  console.log(`Typing Events Handled:    ${typingEventsEmitted}`);
  console.log(`Read Receipts Emitted:    ${readReceiptsEmitted}`);
  console.log("--------------------------------------------------");
  console.log("SERVER PROCESSING LATENCY (Validation + DB Write + Emit):");
  console.log(`  P50:  ${serverLatencyStats.p50} ms`);
  console.log(`  P95:  ${serverLatencyStats.p95} ms`);
  console.log(`  P99:  ${serverLatencyStats.p99} ms`);
  console.log(`  Mean: ${serverLatencyStats.mean} ms`);
  console.log("--------------------------------------------------");
  console.log("END-TO-END DELIVERY LATENCY (Client Send -> Recipient Socket):");
  console.log(`  P50:  ${e2eLatencyStats.p50} ms`);
  console.log(`  P95:  ${e2eLatencyStats.p95} ms`);
  console.log(`  P99:  ${e2eLatencyStats.p99} ms`);
  console.log(`  Mean: ${e2eLatencyStats.mean} ms`);
  console.log("==================================================\n");

  // Save stage metrics
  const stageOutput = path.resolve(__dirname, `results-${TARGET_CONNECTIONS}conns.json`);
  const reportData = {
    targetConnections: TARGET_CONNECTIONS,
    durationSeconds: DURATION_SECONDS,
    connectionSuccessRate: ((connectionSuccess / Math.max(connectionAttempts, 1)) * 100).toFixed(2),
    activeConnections: activeClients.length,
    unexpectedDisconnects: disconnects,
    messagesSent,
    messagesAcked,
    messagesDelivered,
    throughputMessagesPerSec: parseFloat(messagesPerSec),
    serverProcessingLatency: serverLatencyStats,
    endToEndDeliveryLatency: e2eLatencyStats,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(stageOutput, JSON.stringify(reportData, null, 2));

  // Disconnect all clients gracefully
  activeClients.forEach((c) => c.socket.close());

  return reportData;
};

runBenchmark().catch((err) => {
  console.error("Socket.IO benchmark failed:", err);
  process.exit(1);
});
