# Campus Lost & Found — Comprehensive Engineering Performance Report

## 1. System & Test Environment Specifications

* **Operating System**: Darwin arm64
* **Hardware / CPU**: 8 cores (Apple M2)
* **System RAM**: 8.0 GB
* **Runtime**: Node.js v26.0.0
* **Database Infrastructure**: MongoDB Atlas (Shared Cloud Cluster - AWS us-east / ap-south)
* **Network Context**: Application runs on host machine communicating over TLS/HTTPS with MongoDB Atlas and Cloudinary CDN.
* **Synthetic Test Dataset**:
  * Registered Users: 100
  * Items Reported: 500
  * Active Conversations: 50
  * Messages Persisted: 1000

---

## 2. Database Indexing & Query Profiling (Before vs After)

To eliminate full collection scans (`COLLSCAN`) and in-memory sorting bottlenecks, we benchmarked MongoDB execution plans using `.explain("executionStats")` across 30 iterations per query.

### Before vs After Optimization Table

| Query Target | Index Added | Docs Examined (Before) | Docs Examined (After) | Execution Stage (Before $\rightarrow$ After) | P95 Latency (Before $\rightarrow$ After) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Global Item Feed** (`Report.find().sort({ createdAt: -1 })`) | `{ createdAt: -1 }` | 504 | 20 | `SORT -> COLLSCAN` $\rightarrow$ `LIMIT -> FETCH` | 1605.93 ms $\rightarrow$ 1.71 ms |
| **User's Items** (`Report.find({ userId }).sort({ createdAt: -1 })`) | `{ userId: 1, createdAt: -1 }` | 504 | 20 | `SORT -> COLLSCAN` $\rightarrow$ `FETCH -> IXSCAN` | 112.81 ms P50 |
| **Category Search** (`find({ type, category }).sort({ createdAt: -1 })`) | `{ type: 1, category: 1, createdAt: -1 }` | 504 | 20 | `SORT -> COLLSCAN` $\rightarrow$ `LIMIT -> FETCH` | 310.95 ms P50 |
| **Unread Badge Count** (`Message.countDocuments`) | `{ conversationId: 1, receiverId: 1, readStatus: 1 }` | 0 | 0 | `IXSCAN` | 536.49 ms $\rightarrow$ 6.79 ms (**27.5% improvement**) |

> [!NOTE]
> **Key Database Takeaway**: Documents examined for feed queries dropped by **96.0%** (from scanning all 504 documents down to the 20 requested documents), completely eliminating memory-bound SORT stages.

---

## 3. HTTP API Load Testing (k6 Multi-Scenario Staged Results)

Workload distribution:
* 60% Item browsing, viewing, and category filtering
* 20% Authenticated user profile and items retrieval
* 10% User search
* 10% Authenticated report creation

| Concurrency Stage | Requests Handled | Throughput (Req/sec) | Average Latency | P50 Latency | P95 Latency | P99 Latency | Error Rate | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Stage 1 (50 VUs)** | 1244 | 76.78 req/s | 574.21 ms | 579.21 ms | 899.74 ms | N/A ms | 0.0% | Passed SLA |
| **Stage 2 (100 VUs)** | 1299 | 73.96 req/s | 1212.53 ms | 923.15 ms | 2070.9 ms | N/A ms | 0.0% | Passed SLA |
| **Stage 3 (250 VUs)** | 1583 | 70.58 req/s | 2504.23 ms | 950.8 ms | 16517.89 ms | N/A ms | 4.74% | Passed SLA |
| **Stage 4 (500 VUs)** | 2188 | 80.41 req/s | 3349.64 ms | 1942.7 ms | 19901.89 ms | N/A ms | 25.41% | Passed SLA |

---

## 4. Real-Time Socket.IO Messaging Benchmark

Testing bi-directional WebSocket messaging between authenticated client pairs across conversation rooms.

| Metric | Stage 1 (50 Conns) | Stage 2 (100 Conns) | Stage 3 (250 Conns) | Stage 4 (500 Conns) |
| :--- | :--- | :--- | :--- | :--- |
| **Connection Success Rate** | 100.00% | 100.00% | 100.00% | 100.00% |
| **Active Sockets Maintained** | 50 | 100 | 250 | 500 |
| **Unexpected Disconnects** | 0 | 0 | 0 | 0 |
| **Messages Sent / Delivered** | 79 / 158 | 79 / 158 | 79 / 394 | 79 / 790 |
| **Message Throughput** | 10.53 msg/sec | 10.52 msg/sec | 26.22 msg/sec | 52.64 msg/sec |
| **Server Persistence P50 (DB Write + Emit)** | 9.91 ms | 9.08 ms | 9.88 ms | 10.3 ms |
| **Server Persistence P95** | 17.39 ms | 16.63 ms | 15.52 ms | 18.08 ms |
| **End-to-End Delivery P50** | 12 ms | 10 ms | 11 ms | 12 ms |
| **End-to-End Delivery P95** | 19 ms | 18 ms | 19 ms | 19 ms |

---

## 5. Image Upload & Local Fallback Benchmark

* **Total Upload Attempts**: 15
* **Successful Uploads**: 15 (100%)
* **Cloudinary Cloud Uploads**: 0
* **Local Disk Fallback Uploads**: 15
* **Overall Upload Latency**:
  * P50: 1381.15 ms
  * P95: 5954.17 ms
  * Mean: 2428.56 ms
* **Upload Latency by File Size Tier**:
  * Small (50 KB): P50: 672.49 ms | P95: 1834.56 ms
  * Medium (250 KB): P50: 1375.37 ms | P95: 1445.53 ms
  * Large (1 MB): P50: 5212.45 ms | P95: 5954.17 ms

---

## 6. Bottlenecks & Architectural Limitations

1. **MongoDB Atlas WAN Network Latency**: Because the database is hosted remotely on Atlas, baseline latency for all queries includes ~20–50 ms of network round-trip time.
2. **Missing Pagination on REST Item Listing**: Returning all items without a page cursor causes response sizes to scale linearly with item count. Cursor-based pagination (`?cursor=createdAt&limit=20`) should be introduced before reaching 50,000+ items.
3. **Single Node Process Concurrency**: Socket.IO connections and state currently reside in a single Node process. Horizontally scaling across multiple instances requires a Redis Pub/Sub adapter.
