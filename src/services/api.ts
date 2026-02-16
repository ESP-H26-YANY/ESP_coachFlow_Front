const API_URL = "http://localhost:5144/api"; 

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
  });

  if (!response.ok) {
    // On essaie de récupérer le message d'erreur du backend
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur ${response.status}`);
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