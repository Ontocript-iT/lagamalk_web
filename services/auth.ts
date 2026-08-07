export async function loginApi(identifier: string, password: string,turnstileToken: string) {
  try {
    // Use the environment variable here
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Type": "web"
      },
      body: JSON.stringify({ identifier, password,turnstileToken }),
    });

    const data = await response.json();

    if (response.ok || data.status === 200) {
      if (data.role !== "ADMIN") {
        throw new Error("Access Denied. Only ADMIN accounts are permitted.");
      }
      
      // Store token securely
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      
      return data;
    } else {
      throw new Error(data.message || "Invalid credentials");
    }
  } catch (error: any) {
    throw new Error(error.message || "Network error occurred");
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}