import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    // 確保請求頭包含所需的CORS headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    // 根據請求方法設置適當的Content-Type
    if (config.method?.toLowerCase() === 'post') {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 處理特定的錯誤狀態
      switch (error.response.status) {
        case 400:
          console.error('Bad Request:', error.response.data);
          break;
        case 401:
          console.error('Unauthorized:', error.response.data);
          break;
        case 403:
          console.error('Forbidden:', error.response.data);
          break;
        case 405:
          console.error('Method Not Allowed:', error.response.data);
          break;
        default:
          console.error('API Error:', error.response.data);
      }
      
      // 返回錯誤信息
      return Promise.reject(new Error(error.response.data?.detail || '請求失敗，請稍後重試'));
    }
    
    // 處理網絡錯誤
    if (error.request) {
      console.error('Network Error:', error.request);
      return Promise.reject(new Error('網絡錯誤，請檢查您的網絡連接'));
    }
    
    // 處理其他錯誤
    console.error('Error:', error.message);
    return Promise.reject(error);
  }
);
