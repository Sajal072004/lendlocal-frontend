import { baseUrl } from '@/config/axiosUrl';
import axios from 'axios';

const api = axios.create({
  baseURL: `${baseUrl}`, // Your backend URL from .env
  withCredentials: true, // This is crucial for sending cookies
});

export default api;