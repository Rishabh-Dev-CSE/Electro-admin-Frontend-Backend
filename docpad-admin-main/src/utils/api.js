const BASE_URL = 'http://127.0.0.1:8000'

export async function apiGet(url) {
  const token = localStorage.getItem("access");
  if (!token) throw new Error("No token found");
  let res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Token expired
  if (res.status === 401) {
    const refresh = localStorage.getItem("refresh");

    if (refresh) {
      const refreshRes = await fetch(`${BASE_URL}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      const newData = await refreshRes.json();
      if (newData.access) {
        localStorage.setItem("access", newData.access);
        return apiGet(url); 
      }
    }

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    // window.location.href = "/auth/login";
  }

  // NEW IMPORTANT FIX
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw {
      status: res.status,
      message: errorData?.error || errorData?.message || "Request failed"
    };
  }

  return res.json();
}

export async function apiPost(url, data) {
  const token = localStorage.getItem("access");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers,
    credentials: "include", // IMPORTANT (cookie refresh)
    body: JSON.stringify(data),
  });


  if (res.status === 401) {
    // CALL REFRESH (cookie based)
    const refreshRes = await fetch(`${BASE_URL}/api/refresh/`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();

      if (refreshData.access) {
        localStorage.setItem("access", refreshData.access);
        return apiPost(url, data); // retry original request
      }
    }

    // ❌ REFRESH FAILED → LOGOUT
    localStorage.removeItem("access");
    localStorage.removeItem("user");
    // window.location.href = "/auth/login";
    return;
  }

  return res.json();
}


export async function apiPostForm(url, formData, method = "POST") {
  const token = localStorage.getItem("access");

  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,          //  NO Content-Type here
    body: formData,   //  browser sets boundary itself
  });

  if (res.status === 401) {
    const refresh = localStorage.getItem("refresh");
    if (refresh) {
      const refreshRes = await fetch(`${BASE_URL}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      const newData = await refreshRes.json();
      if (newData.access) {
        localStorage.setItem("access", newData.access);
        return apiPostForm(url, formData, method);
      }
    }

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }

  return res.json();
}


export async function apiDelete(url) {
  const token = localStorage.getItem("access");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  let res = await fetch(`${BASE_URL}${url}`, {
    method: "DELETE",
    headers,
  });

  if (res.status === 401) {
    const refresh = localStorage.getItem("refresh");

    if (refresh) {
      const refreshRes = await fetch(`${BASE_URL}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      const newData = await refreshRes.json();
      if (newData.access) {
        localStorage.setItem("access", newData.access);
        return apiDelete(url);
      }
    }

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Delete failed");
  }

  return data;
}

export async function apiUpdate(url, data) {
  const token = localStorage.getItem("access");

  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const isFormData = data instanceof FormData;

  const res = await fetch(`${BASE_URL}${url}`, {
    method: "PUT",
    headers: isFormData ? headers : { ...headers, "Content-Type": "application/json" },
    body: isFormData ? data : JSON.stringify(data),
  });

  if (res.status === 401) {
    const refresh = localStorage.getItem("refresh");

    if (refresh) {
      const refreshRes = await fetch(`${BASE_URL}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      const newData = await refreshRes.json();
      if (newData.access) {
        localStorage.setItem("access", newData.access);
        return apiUpdate(url, data);
      }
    }

    localStorage.clear();
  }

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || json.message || "Update failed");
  }

  return json;
}
