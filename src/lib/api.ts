const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return "/api";

  // Remove trailing slash if present
  const base = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;

  // Ensure it ends with /api if it's an external URL
  return base.endsWith('/api') ? base : `${base}/api`;
};

const API_BASE_URL = getApiBaseUrl();

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from localStorage
  const savedUser = localStorage.getItem("jobmitra_user");
  const token = savedUser ? JSON.parse(savedUser).token : null;

  const isFormData = options.body instanceof FormData;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 403) {
        throw new Error("Access Denied (403): Your session may have expired or you don't have permission. Please log out and log back in.");
      }
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return response.text();
  } catch (error: any) {
    console.error(`API Fetch Error [${url}]:`, error);
    if (error.message === "Failed to fetch") {
      throw new Error("Network error or CORS issue. Please ensure the backend is running and allows this origin.");
    }
    throw error;
  }
}
