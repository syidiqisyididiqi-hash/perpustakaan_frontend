const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export function getAuthHeader() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return token ? `Bearer ${token}` : null;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  const token = getAuthHeader();
  if (token) {
    headers.set("Authorization", token);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
}