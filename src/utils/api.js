const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getAuthHeaders = () => {
  return {};
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
