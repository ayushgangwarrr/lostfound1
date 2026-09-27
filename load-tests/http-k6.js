import http from "k6/http";
import { check, sleep, group } from "k6";
import { Rate, Trend } from "k6/metrics";

// Custom Prometheus/k6 metrics
const errorRate = new Rate("error_rate");
const browseLatency = new Trend("browse_latency_ms");
const authLatency = new Trend("auth_latency_ms");
const createReportLatency = new Trend("create_report_latency_ms");
const userSearchLatency = new Trend("user_search_latency_ms");

// Load fixtures
let fixtures;
try {
  fixtures = JSON.parse(open("./test-fixtures.json"));
} catch (_e) {
  fixtures = { users: [], reports: [] };
}

const BASE_URL = __ENV.BASE_URL || "http://localhost:5001";
const DURATION = __ENV.DURATION || "30s";
const TARGET_VUS = parseInt(__ENV.VUS || "50", 10);
const STAGE_MODE = __ENV.STAGE_MODE || "single"; // "single" or "ramping"

// Configure stages based on mode
export const options = {
  thresholds: {
    http_req_failed: ["rate<0.02"], // Error rate < 2%
    http_req_duration: ["p(95)<1500", "p(99)<3000"], // SLA thresholds for Atlas cloud backend
    error_rate: ["rate<0.02"],
  },
  ...(STAGE_MODE === "ramping"
    ? {
        stages: [
          { duration: "20s", target: 50 },
          { duration: "30s", target: 100 },
          { duration: "30s", target: 250 },
          { duration: "30s", target: 500 },
          { duration: "10s", target: 0 },
        ],
      }
    : {
        vus: TARGET_VUS,
        duration: DURATION,
      }),
};

export default function () {
  const userCount = fixtures.users ? fixtures.users.length : 0;
  const reportCount = fixtures.reports ? fixtures.reports.length : 0;

  // Pick deterministic or random fixture
  const userIdx = (__VU + __ITER) % Math.max(userCount, 1);
  const fixtureUser = userCount > 0 ? fixtures.users[userIdx] : null;
  const token = fixtureUser ? fixtureUser.token : null;

  const authHeaders = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const roll = Math.random();

  // Scenario 1: Browsing & Search (60% weight)
  if (roll < 0.60) {
    group("Item Browsing & Search", () => {
      // 1. Global report listing
      const tStart = Date.now();
      const listRes = http.get(`${BASE_URL}/api/reports`, {
        headers: { "Content-Type": "application/json" },
      });
      browseLatency.add(Date.now() - tStart);
      const listOk = check(listRes, {
        "reports list status is 200": (r) => r.status === 200,
        "reports list has body": (r) => r.body && r.body.length > 0,
      });
      errorRate.add(!listOk);

      // 2. View specific report by ID
      if (reportCount > 0) {
        const reportIdx = (__ITER * 3) % reportCount;
        const reportId = fixtures.reports[reportIdx].id;
        const itemRes = http.get(`${BASE_URL}/api/reports/${reportId}`);
        check(itemRes, {
          "single report status is 200 or 404": (r) => r.status === 200 || r.status === 404,
        });
      }

      // 3. Filtered query
      const filterRes = http.get(`${BASE_URL}/api/reports?type=lost&category=Electronics`);
      check(filterRes, {
        "filtered reports status is 200": (r) => r.status === 200,
      });
    });
  }
  // Scenario 2: Authenticated User Actions (20% weight)
  else if (roll < 0.80) {
    group("Authenticated Profile & User Reports", () => {
      if (!token) return;

      // 1. Profile retrieval
      const tStart = Date.now();
      const profileRes = http.get(`${BASE_URL}/api/auth/profile`, authHeaders);
      authLatency.add(Date.now() - tStart);
      const profileOk = check(profileRes, {
        "profile status is 200": (r) => r.status === 200,
      });
      errorRate.add(!profileOk);

      // 2. User's own reports
      const myReportsRes = http.get(`${BASE_URL}/api/reports/user`, authHeaders);
      check(myReportsRes, {
        "user reports status is 200": (r) => r.status === 200,
      });
    });
  }
  // Scenario 3: User Search (10% weight)
  else if (roll < 0.90) {
    group("User Search", () => {
      if (!token) return;
      const tStart = Date.now();
      const searchRes = http.get(`${BASE_URL}/api/users/search?q=Bench`, authHeaders);
      userSearchLatency.add(Date.now() - tStart);
      const searchOk = check(searchRes, {
        "user search status is 200": (r) => r.status === 200,
      });
      errorRate.add(!searchOk);
    });
  }
  // Scenario 4: Item Creation (10% weight)
  else {
    group("Item Creation", () => {
      if (!token) return;
      const payload = JSON.stringify({
        type: Math.random() > 0.5 ? "lost" : "found",
        itemName: `[LOAD-TEST] Item VU${__VU}-${__ITER}`,
        description: "Simulated load test report submission",
        phone: "9998887777",
        location: "Campus Library Level 2",
        category: "Electronics",
      });

      const tStart = Date.now();
      const createRes = http.post(`${BASE_URL}/api/report`, payload, authHeaders);
      createReportLatency.add(Date.now() - tStart);
      const createOk = check(createRes, {
        "report creation status is 201": (r) => r.status === 201,
      });
      errorRate.add(!createOk);
    });
  }

  // Think time: 50ms - 200ms realistic pacing
  sleep(0.05 + Math.random() * 0.15);
}
