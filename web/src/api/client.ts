import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://taskflow-backend-le59.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
