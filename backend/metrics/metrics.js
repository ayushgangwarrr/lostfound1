import {
  collectDefaultMetrics,
  register,
  Counter,
  Histogram,
  Gauge,
} from "prom-client";

// Collect default node metrics (CPU, memory, event loop, etc.)
collectDefaultMetrics({ timeout: 5000 });

// HTTP metrics
export const httpRequestCount = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

// Socket.IO lifecycle metrics
export const socketConnectionAttempts = new Counter({
  name: "socket_connection_attempts_total",
  help: "Total socket connection attempts",
});

export const socketConnectionSuccess = new Counter({
  name: "socket_connection_success_total",
  help: "Total successful socket connections",
});

export const socketConnectionFailures = new Counter({
  name: "socket_connection_failures_total",
  help: "Total failed socket connection attempts",
  labelNames: ["reason"],
});

export const socketDisconnects = new Counter({
  name: "socket_disconnects_total",
  help: "Total socket disconnects",
});

export const activeSocketConnections = new Gauge({
  name: "active_socket_connections",
  help: "Current active socket connections",
});

// Socket.IO messaging metrics
export const socketMessagesReceived = new Counter({
  name: "socket_messages_received_total",
  help: "Total messages received by server",
});

export const socketMessagesDelivered = new Counter({
  name: "socket_messages_delivered_total",
  help: "Total messages emitted/delivered by server",
});

export const socketTypingEvents = new Counter({
  name: "socket_typing_events_total",
  help: "Total typing indicator events",
  labelNames: ["type"], // "start" or "stop"
});

export const socketReadReceiptEvents = new Counter({
  name: "socket_read_receipt_events_total",
  help: "Total read receipt events handled",
});

// Server-side message persistence & emit latency
export const messageDeliveryLatency = new Histogram({
  name: "message_delivery_latency_seconds",
  help: "Message delivery latency in seconds (server processing + DB write + emit)",
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
});

// End-to-end receipt latency (from client sender timestamp to recipient client receipt)
export const messageEndToEndLatency = new Histogram({
  name: "message_e2e_latency_seconds",
  help: "End-to-end message latency from client send to recipient delivery",
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2],
});

// Upload metrics
export const uploadsAttempt = new Counter({
  name: "uploads_attempt_total",
  help: "Total upload attempts",
});

export const uploadsSuccess = new Counter({
  name: "uploads_success_total",
  help: "Total successful uploads",
});

export const uploadsFallback = new Counter({
  name: "uploads_fallback_total",
  help: "Total uploads written to local fallback",
});

export const uploadDuration = new Histogram({
  name: "upload_duration_seconds",
  help: "Total upload duration in seconds",
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3, 5, 10],
});

export const cloudinaryUploadDuration = new Histogram({
  name: "cloudinary_upload_duration_seconds",
  help: "Cloudinary upload duration in seconds",
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10],
});

export const localFallbackDuration = new Histogram({
  name: "local_fallback_duration_seconds",
  help: "Local filesystem fallback upload duration in seconds",
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.5],
});

// Database query metrics
export const dbQueryDuration = new Histogram({
  name: "db_query_duration_seconds",
  help: "Database query execution duration in seconds",
  labelNames: ["collection", "operation"],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2],
});

export { register as metricsRegistry };
