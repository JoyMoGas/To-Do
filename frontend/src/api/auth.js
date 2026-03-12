import axios from "axios";

// Interceptar todas las peticiones para agregar el token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/activities/";
  // la URL del backend token es /api/token/
  const TOKEN_URL = API_URL.replace("activities/", "token/"); 
  
  const response = await axios.post(TOKEN_URL, {
    username,
    password,
  });
  
  if (response.data.access) {
    localStorage.setItem("accessToken", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);
    
    // Decodificar el JWT para obtener el nombre de usuario de forma sencilla
    const base64Url = response.data.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const decoded = JSON.parse(jsonPayload);
    localStorage.setItem("username", decoded.username || username);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};
