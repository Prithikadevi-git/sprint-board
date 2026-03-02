import axios from 'axios';

// Logic: Use Env Var if exists, otherwise check if we are on localhost
const isLocalhost = window.location.hostname === 'localhost';
const productionURL = 'https://sprint-board-o57n.onrender.com/api';
const localURL = 'http://localhost:5000/api';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isLocalhost ? localURL : productionURL),
});

// Interceptor to handle JWT and dynamic headers
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor to handle global errors (like 401 Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
