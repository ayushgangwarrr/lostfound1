const defaultProductionApi = "https://lostfound1-wfyy.onrender.com";
const configuredApiBase =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "production" || (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1")
    ? defaultProductionApi
    : "http://localhost:5001");

// Keep the frontend and API on the same local hostname. `localhost` and
// `127.0.0.1` are different sites to the browser, so mixing them prevents the
// authentication cookie from being sent back on profile requests.
const getApiBase = () => {
  if (typeof window === "undefined") return configuredApiBase;

  try {
    const apiUrl = new URL(configuredApiBase);
    const isLocalApi = ["localhost", "127.0.0.1"].includes(apiUrl.hostname);
    const isLocalPage = ["localhost", "127.0.0.1"].includes(window.location.hostname);

    if (isLocalApi && isLocalPage) {
      apiUrl.hostname = window.location.hostname;
      return apiUrl.origin;
    }
  } catch {
    // A relative VITE_API_URL is already suitable for the current origin.
  }

  return configuredApiBase;
};

const API_BASE = getApiBase();

export const getAuthHeaders = () => {
  return {};
};

export const resolveImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop";
  }
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${API_BASE}${imagePath}`;
};

export const fetchJson = async (url, options = {}) => {
  const response = await fetch(`${API_BASE}${url}`, {
    credentials: "include",
    ...options,
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    throw error;
  }
  return data;
};

export default API_BASE;
