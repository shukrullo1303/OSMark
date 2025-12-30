import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Provide clearer error messages for network / CORS issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Likely network error or CORS blocked the request
      return Promise.reject(new Error('Network Error: Unable to reach API. Is the backend running and CORS enabled?'));
    }
    return Promise.reject(error);
  }
);

export default api;
