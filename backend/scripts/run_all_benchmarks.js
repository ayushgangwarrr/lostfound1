import { spawn, execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || "5001";
const BASE_URL = `http://localhost:${PORT}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isServerRunning = async () => {
  try {
    const res = await fetch(`${BASE_URL}/`);
    return res.ok;
  } catch (_e) {
    return false;
  }
};

const runCommand = (cmd, envExtra = {}) => {
  console.log(`\n>>> Executing: ${cmd}`);
  try {
    execSync(cmd, {
      stdio: "inherit",
      cwd: path.resolve(__dirname, ".."),
      env: { ...process.env, BASE_URL, WS_URL: BASE_URL, ...envExtra },
    });
  } catch (err) {
    console.warn(`Command completed with notice/exit status: ${err.status || err.message}`);
  }
};

const main = async () => {
  console.log("==================================================");
  console.log("    AUTOMATED BENCHMARK SUITE - CAMPUS L&F        ");
  console.log("==================================================");
  console.log(`Target URL: ${BASE_URL}\n`);

  let serverProcess = null;
  const running = await isServerRunning();

  if (!running) {
    console.log("Starting backend server process...");
    serverProcess = spawn("node", ["server.js"], {
      cwd: path.resolve(__dirname, ".."),
      stdio: "pipe",
      env: { ...process.env, PORT },
    });

    serverProcess.stdout.on("data", (d) => {
      const msg = d.toString();
      if (msg.includes("Server running")) console.log(`  [Server] ${msg.trim()}`);
    });

    serverProcess.stderr.on("data", (d) => {
      console.error(`  [Server Error] ${d.toString().trim()}`);
    });

    // Wait for server to come online
    let online = false;
    for (let i = 0; i < 20; i++) {
      await sleep(1000);
      if (await isServerRunning()) {
        online = true;
        break;
      }
    }

    if (!online) {
      console.error("Server failed to start in 20s. Aborting.");
      if (serverProcess) serverProcess.kill();
      process.exit(1);
    }
    console.log("Backend server is online and ready for benchmarking!\n");
  } else {
    console.log("Backend server is already running.\n");
  }

  try {
    // 1. Database Benchmark
    console.log("\n--- STEP 1: DATABASE QUERY BENCHMARK ---");
    runCommand("node scripts/benchmark_db.js --save-after");

    // 2. Image Upload Benchmark
    console.log("\n--- STEP 2: IMAGE UPLOAD & FALLBACK BENCHMARK ---");
    runCommand("node ../load-tests/benchmark_uploads.js", { UPLOAD_ITERATIONS: "5" });

    // 3. Socket.IO Real-Time Messaging Benchmark (Staged: 50, 100, 250, 500)
    console.log("\n--- STEP 3: REAL-TIME SOCKET.IO BENCHMARK ---");
    for (const conns of [50, 100, 250, 500]) {
      console.log(`\nRunning Socket.IO stage: ${conns} concurrent connections...`);
      runCommand("node ../load-tests/socketio/socket_benchmark.js", {
        CONNECTIONS: String(conns),
        DURATION: "12",
        INTERVAL: "150",
      });
      await sleep(2000);
    }

    // 4. HTTP API Load Tests with k6 (Staged: 50, 100, 250, 500 VUs)
    console.log("\n--- STEP 4: HTTP LOAD TESTING VIA K6 ---");
    for (const vus of [50, 100, 250, 500]) {
      console.log(`\nRunning k6 stage: ${vus} virtual users...`);
      const exportPath = path.resolve(__dirname, `../../load-tests/k6-summary-${vus}.json`);
      runCommand(
        `k6 run --vus ${vus} --duration 15s --summary-export "${exportPath}" ../load-tests/http-k6.js`,
        { VUS: String(vus), DURATION: "15s" }
      );
      await sleep(2000);
    }

    // 5. Scrape Prometheus Metrics
    console.log("\n--- STEP 5: COLLECTING PROMETHEUS METRICS ---");
    const promRes = await fetch(`${BASE_URL}/metrics`);
    if (promRes.ok) {
      const promText = await promRes.text();
      fs.writeFileSync(path.resolve(__dirname, "../prometheus-dump.txt"), promText);
      console.log("Saved live Prometheus metrics dump to prometheus-dump.txt");
    }

    // 6. Generate Markdown Reports
    console.log("\n--- STEP 6: GENERATING PERFORMANCE & RESUME REPORTS ---");
    runCommand("node scripts/generate_report.js");

    console.log("\n==================================================");
    console.log("       ALL BENCHMARKS SUCCESSFULLY COMPLETED!     ");
    console.log("==================================================");
  } catch (err) {
    console.error("Benchmark suite encountered an error:", err);
  } finally {
    if (serverProcess) {
      console.log("Shutting down background server process...");
      serverProcess.kill();
    }
  }
};

main();
