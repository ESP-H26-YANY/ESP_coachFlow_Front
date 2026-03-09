const API_URL = import.meta.env.VITE_API_URL; 

const request = async <T>(endpoint: string, options: RequestInit): Promise<T> => {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur ${response.status}`);
  }
  if (response.status === 204) {
      return null as unknown as T;
  }

  return response.json();
};

export const authService = {
  login: (data: import("../types/auth").LoginRequest) => 
    request<import("../types/auth").AuthResponse>("/Auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: import("../types/auth").RegisterRequest) =>
    request<import("../types/auth").User>("/Auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const guideService = {
  getByUser: (userId: string) => 
    request<import("../types/guide").Guide[]>(`/Guide/user/${userId}`, {
      method: "GET",
    }),

  delete: (id: string) =>
    request<void>(`/Guide/${id}`, {
      method: "DELETE",
    }),
};