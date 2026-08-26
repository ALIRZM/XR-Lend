import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // local
  //baseURL: 'http://YOUR_EC2_IP:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

// Every protected route needs the token. Without this the server returns 401.
axiosInstance.interceptors.request.use((config) => {
  const stored = localStorage.getItem('xrlend-user');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
