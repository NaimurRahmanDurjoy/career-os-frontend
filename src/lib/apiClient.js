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

      // 🛡️ SAFE GUARD: Allow explicit authentication checks (`/user`) and the actual login route
      // to resolve locally instead of a hard redirect.
      if (error.config.url.includes('/user') || error.config.url.includes('/login')) {
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
    // Intercepts 403 rejections that carry the required_logout flag for suspended users
    if (error.response && error.response.status === 403 && error.response.data?.require_logout) {
      localStorage.removeItem('token');

      if (error.config.url.includes('/login')) {
        return Promise.reject(error);
      }

      sessionStorage.setItem('auth_error', error.response.data.message || 'Your account has been suspended by an administrator.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;