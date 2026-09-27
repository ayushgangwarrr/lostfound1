import { httpRequestCount, httpRequestDuration } from "../metrics/metrics.js";

// Sanitize paths that do not have matched Express route patterns (e.g. 404s or static files)
// to prevent Prometheus label cardinality explosion.
const sanitizePath = (pathname = "") => {
  return pathname
    .replace(/\/[0-9a-fA-F]{24}(\b|\/)/g, "/:id$1") // Replace MongoDB ObjectIds
    .replace(/\/[0-9]+(\b|\/)/g, "/:id$1")           // Replace numeric IDs
    .replace(/\/[a-f0-9-]{36}(\b|\/)/gi, "/:id$1");  // Replace UUIDs
};

const getNormalizedRoute = (req) => {
  try {
    // Express populates req.route and req.baseUrl after matching
    if (req.baseUrl && req.route && req.route.path) {
      return `${req.baseUrl}${req.route.path}`;
    }
    if (req.route && req.route.path) {
      return req.route.path;
    }
    if (req.baseUrl) {
      return `${req.baseUrl}/*`;
    }
    const rawPath = req.originalUrl ? req.originalUrl.split("?")[0] : (req.path || "unknown");
    return sanitizePath(rawPath);
  } catch (_err) {
    return "unknown";
  }
};

export default function metricsMiddleware(req, res, next) {
  // Do not record Prometheus metrics endpoint itself to avoid recursion
  if (req.path === "/metrics") {
    return next();
  }

  const endTimer = httpRequestDuration.startTimer();

  res.on("finish", () => {
    try {
      const route = getNormalizedRoute(req);
      const method = req.method;
      const status = res.statusCode ? String(res.statusCode) : "500";

      const labels = { method, route, status };
      httpRequestCount.inc(labels);
      endTimer(labels);
    } catch (_e) {
      // Metrics collection must never throw or disrupt application flow
    }
  });

  next();
}
