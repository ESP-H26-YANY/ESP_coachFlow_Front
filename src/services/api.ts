const API_URL = import.meta.env.VITE_API_URL; 

const request = async <T>(endpoint: string, options: RequestInit): Promise<T> => {
  const token = localStorage.getItem("token");
  
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  if (!isFormData) {
    (headers as any)["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", 
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur ${response.status}`);
  }

  if (response.status === 204) return null as unknown as T;
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

  create: (data: any) => { 
    const formData = new FormData();
    
    //IA : Je dois faire ca afin de pouvoir envoyer le fichier PDF dans la requete, et comme le backend attend un multipart/form-data,
    // je dois construire manuellement le FormData.

    // On transforme l'objet reçu en FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string | Blob);
      }
    });

    return request<import("../types/guide").Guide>("/Guide", {
      method: "POST",
      body: formData, 
    });
  },

  getAll: () => 
    request<import("../types/guide").Guide[]>("/Guide", {
      method: "GET",
    }),
};

