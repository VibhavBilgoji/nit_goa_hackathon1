// Admin API wrapper with automatic authentication bypass
// This ensures all admin API calls work with the bypass authentication

/**
 * Custom fetch wrapper for admin API calls
 * Automatically adds bypass header and authorization token
 */
export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("citypulse_auth_token");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "x-admin-bypass": "true",
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * GET request wrapper
 */
export async function adminGet(url: string): Promise<any> {
  const response = await adminFetch(url);
  return response.json();
}

/**
 * POST request wrapper
 */
export async function adminPost(url: string, data: any): Promise<any> {
  const response = await adminFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * PUT request wrapper
 */
export async function adminPut(url: string, data: any): Promise<any> {
  const response = await adminFetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * PATCH request wrapper
 */
export async function adminPatch(url: string, data: any): Promise<any> {
  const response = await adminFetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * DELETE request wrapper
 */
export async function adminDelete(url: string): Promise<any> {
  const response = await adminFetch(url, {
    method: "DELETE",
  });
  return response.json();
}

/**
 * Utility to check if we're in admin bypass mode
 */
export function isAdminBypassActive(): boolean {
  const token = localStorage.getItem("citypulse_auth_token");
  const user = localStorage.getItem("citypulse_user");

  if (!token || !user) return false;

  try {
    const userData = JSON.parse(user);
    return userData.role === "admin" && userData.id === "admin-bypass-001";
  } catch {
    return false;
  }
}
