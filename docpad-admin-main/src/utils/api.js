// const BASE_URL = "https://electro-admin-frontend-backend.onrender.com";
const BASE_URL = "http://127.0.0.1:8000"

/* =========================
   HELPERS
========================= */

function getAccessToken() {
  return localStorage.getItem("access");
}

function getRefreshToken() {
  return localStorage.getItem("refresh");
}

function authHeaders(extra = {}) {
  const token = getAccessToken();
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...extra,
  };
}

/* =========================
   TOKEN REFRESH
========================= */

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  const res = await fetch(`${BASE_URL}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) return false;

  const data = await res.json();
  if (data.access) {
    localStorage.setItem("access", data.access);
    return true;
  }

  return false;
}

/* =========================
   GET
========================= */

export async function apiGet(url) {
  let res = await fetch(`${BASE_URL}${url}`, {
    headers: authHeaders({ "Content-Type": "application/json" }),
  });

  if (res.status === 401 && (await refreshAccessToken())) {
    return apiGet(url);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw {
      status: res.status,
      message: data?.error || data?.message || "Request failed",
    };
  }

  return data;
}

/* =========================
   POST (JSON)
========================= */

export async function apiPost(url, data) {
  let res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });

  if (res.status === 401 && (await refreshAccessToken())) {
    return apiPost(url, data);
  }

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw {
      status: res.status,
      message: result?.error || result?.message || "Post failed",
    };
  }

  return result;
}

/* =========================
   POST / PUT (FORM DATA)
========================= */

export async function apiPostForm(url, formData, method = "POST") {
  let res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: authHeaders(), // ❌ no Content-Type here
    body: formData,
  });

  if (res.status === 401 && (await refreshAccessToken())) {
    return apiPostForm(url, formData, method);
  }

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw {
      status: res.status,
      message: result?.error || result?.message || "Form request failed",
    };
  }

  return result;
}

/* =========================
   PUT (JSON)
========================= */

export async function apiUpdate(url, data) {
  let res = await fetch(`${BASE_URL}${url}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });

  if (res.status === 401 && (await refreshAccessToken())) {
    return apiUpdate(url, data);
  }

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw {
      status: res.status,
      message: result?.error || result?.message || "Update failed",
    };
  }

  return result;
}

/* =========================
   DELETE
========================= */

export async function apiDelete(url) {
  let res = await fetch(`${BASE_URL}${url}`, {
    method: "DELETE",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });

  if (res.status === 401 && (await refreshAccessToken())) {
    return apiDelete(url);
  }

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw {
      status: res.status,
      message: result?.error || result?.message || "Delete failed",
    };
  }

  return result;
}
