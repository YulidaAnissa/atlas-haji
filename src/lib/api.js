import axios from "axios";

const api = axios.create({
  //baseURL: process.env.NEXT_PUBLIC_API_URL,
  baseURL: "/api/proxy",
});

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (!token) return config;

  if (isTokenExpired(token)) {
    logout();
    return Promise.reject(new Error("Token expired"));
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      logout();
    }

    return Promise.reject(error);
  }
);

export default api;