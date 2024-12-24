import axios from 'axios';

// Axios 기본 설정
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CODE_RACER_API_URL, // 백엔드 API 주소
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Bearer 접두사 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
