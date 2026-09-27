import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURES_PATH = path.resolve(__dirname, "test-fixtures.json");
const BASE_URL = process.env.BASE_URL || "http://localhost:5001";
const ITERATIONS = parseInt(process.env.UPLOAD_ITERATIONS || "5", 10);
const OUTPUT_FILE = path.resolve(__dirname, "upload-benchmark-results.json");

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

// Create a valid minimalist PNG image buffer
const createMockImageBuffer = (sizeBytes = 50 * 1024) => {
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const fill = Buffer.alloc(Math.max(sizeBytes - header.length, 0), 0xaa);
  return Buffer.concat([header, fill]);
};

const uploadItem = async (token, buffer, filename = "test_item.png") => {
  const form = new FormData();
  form.append("type", "lost");
  form.append("itemName", `[UPLOAD-BENCH] Item ${Date.now()}`);
  form.append("description", "Image upload benchmark sample item");
  form.append("phone", "9998887777");
  form.append("location", "Science Block");
  form.append("category", "Electronics");

  // Native Blob for multipart payload
  const blob = new Blob([buffer], { type: "image/png" });
  form.append("image", blob, filename);

  const start = process.hrtime();
  const res = await fetch(`${BASE_URL}/api/report`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  const diff = process.hrtime(start);
  const durationMs = diff[0] * 1000 + diff[1] / 1e6;
  const body = await res.json().catch(() => ({}));

  return {
    statusCode: res.status,
    durationMs,
    body,
  };
};

const runUploadBenchmark = async () => {
  if (!fs.existsSync(FIXTURES_PATH)) {
    console.error("Test fixtures not found. Run generate_test_data.js first.");
    process.exit(1);
  }

  const fixtures = JSON.parse(fs.readFileSync(FIXTURES_PATH, "utf8"));
  const token = fixtures.users?.[0]?.token;
  if (!token) {
    console.error("No valid token in test fixtures.");
    process.exit(1);
  }

  console.log("==================================================");
  console.log("        IMAGE UPLOAD & FALLBACK BENCHMARK         ");
  console.log("==================================================");
  console.log(`Endpoint:    POST ${BASE_URL}/api/report`);
  console.log(`Iterations:  ${ITERATIONS} per size tier\n`);

  const latencies = [];
  let successCount = 0;
  let failureCount = 0;
  let cloudinaryCount = 0;
  let fallbackCount = 0;

  const testSizes = [
    { label: "Small (50 KB)", size: 50 * 1024 },
    { label: "Medium (250 KB)", size: 250 * 1024 },
    { label: "Large (1 MB)", size: 1024 * 1024 },
  ];

  const sizeResults = {};

  for (const sizeMeta of testSizes) {
    console.log(`Benchmarking payload: ${sizeMeta.label}...`);
    const sizeLatencies = [];
    const buffer = createMockImageBuffer(sizeMeta.size);

    for (let i = 1; i <= ITERATIONS; i++) {
      try {
        const result = await uploadItem(token, buffer, `bench_${sizeMeta.size}_${i}.png`);
        if (result.statusCode === 201) {
          successCount++;
          latencies.push(result.durationMs);
          sizeLatencies.push(result.durationMs);

          const imgUrl = result.body?.report?.image || "";
          const isFallback = imgUrl.startsWith("/uploads/");
          if (isFallback) {
            fallbackCount++;
          } else {
            cloudinaryCount++;
          }
          console.log(`  [${i}/${ITERATIONS}] HTTP ${result.statusCode} in ${result.durationMs.toFixed(1)} ms (Destination: ${isFallback ? "Local Disk Fallback" : "Cloudinary Cloud"})`);
        } else {
          failureCount++;
          console.warn(`  [${i}/${ITERATIONS}] HTTP ${result.statusCode}:`, result.body?.message);
        }
      } catch (err) {
        failureCount++;
        console.error(`  [${i}/${ITERATIONS}] Failed:`, err.message);
      }
    }

    sizeResults[sizeMeta.label] = calculatePercentiles(sizeLatencies);
  }

  const totalAttempts = successCount + failureCount;
  const overallPercentiles = calculatePercentiles(latencies);
  const successRate = totalAttempts > 0 ? ((successCount / totalAttempts) * 100).toFixed(2) : "0.00";

  console.log("\n==================================================");
  console.log("           IMAGE UPLOAD BENCHMARK RESULTS         ");
  console.log("==================================================");
  console.log(`Total Upload Attempts:   ${totalAttempts}`);
  console.log(`Successful Uploads:      ${successCount}`);
  console.log(`Failed Uploads:          ${failureCount}`);
  console.log(`Success Rate:            ${successRate}%`);
  console.log(`Cloudinary Uploads:      ${cloudinaryCount}`);
  console.log(`Local Fallback Uploads:  ${fallbackCount}`);
  console.log("--------------------------------------------------");
  console.log("LATENCY BY FILE SIZE:");
  for (const [label, p] of Object.entries(sizeResults)) {
    console.log(`  ${label.padEnd(20)}: Mean: ${p.mean} ms | P50: ${p.p50} ms | P95: ${p.p95} ms | P99: ${p.p99} ms`);
  }
  console.log("--------------------------------------------------");
  console.log("OVERALL UPLOAD LATENCY:");
  console.log(`  Mean:  ${overallPercentiles.mean} ms`);
  console.log(`  P50:   ${overallPercentiles.p50} ms`);
  console.log(`  P95:   ${overallPercentiles.p95} ms`);
  console.log(`  P99:   ${overallPercentiles.p99} ms`);
  console.log("==================================================\n");

  const report = {
    timestamp: new Date().toISOString(),
    totalAttempts,
    successful: successCount,
    failed: failureCount,
    successRate: parseFloat(successRate),
    cloudinaryUploads: cloudinaryCount,
    fallbackUploads: fallbackCount,
    overallLatency: overallPercentiles,
    byFileSize: sizeResults,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  console.log(`Wrote upload benchmark results to: ${OUTPUT_FILE}`);
};

runUploadBenchmark().catch((err) => {
  console.error("Upload benchmark failed:", err);
  process.exit(1);
});
