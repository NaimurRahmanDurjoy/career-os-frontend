import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

/**
 * Isolated Axios instance dedicated solely to the primary application backend API
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request Interceptor: Dynamically injects the active Sanctum Bearer token prior to transmission
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Intercepts structural 401 errors caused by invalid or expired server-side tokens
    if (error.response && error.response.status === 401) {

      // 🛡️ SAFE GUARD: রিকোয়েস্টটি যদি কারেন্ট ইউজার ভেরিফিকেশনের (/user) জন্য হয়ে থাকে, 
      // এবং টোকেন ব্রাউজারে অলরেডি থাকে, তবে রিলোড টাইমিং কনফ্লিক্টের কারণে টোকেন ডিলিট করা যাবে না।
      if (error.config.url.includes('/user')) {
        return Promise.reject(error);
      }

      // জেনুইন ৪০১ এরর হলে তখন টোকেন ফেলে দিয়ে রিডাইরেক্ট করবে
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Listens globally for network payloads and forces user eviction on 401 errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Intercepts structural 401 errors caused by invalid or expired server-side tokens
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');

      // Forces a soft reload or window redirect to purge stale runtime states cleanly
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;