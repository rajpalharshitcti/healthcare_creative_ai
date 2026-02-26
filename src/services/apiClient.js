import { getAuthToken } from "./authStorage.js";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

const buildUrl = (path, params) => {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params && typeof params === "object") {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : { success: false, message: "Unexpected response format" };

  if (!response.ok || body.success === false) {
    const message = body?.message || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.details = body?.details || null;
    throw error;
  }

  return body;
};

export const apiRequest = async ({
  path,
  method = "GET",
  params,
  data,
  token,
  withAuth = false
}) => {
  const authToken = token || (withAuth ? getAuthToken() : null);
  const response = await fetch(buildUrl(path, params), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {})
  });

  return parseResponse(response);
};

export const apiGet = (path, options = {}) => apiRequest({ ...options, path, method: "GET" });
export const apiPost = (path, data, options = {}) => apiRequest({ ...options, path, method: "POST", data });
export const apiPut = (path, data, options = {}) => apiRequest({ ...options, path, method: "PUT", data });
export const apiPatch = (path, data, options = {}) => apiRequest({ ...options, path, method: "PATCH", data });
