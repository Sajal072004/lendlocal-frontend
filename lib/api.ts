import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Your backend URL from .env
  withCredentials: true, // This is crucial for sending cookies
});

export default api;