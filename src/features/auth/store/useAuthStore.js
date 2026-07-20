import { create } from 'zustand';
import { authApi } from '../services/authApi';
import apiClient from '../../../lib/apiClient';

/**
 * Decoupled Zustand state slice managing structural session states globally across the application lifecycle
 */
export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: !!localStorage.getItem('token'),

  /**
   * Resolves active user sessions on initial system load or subsequent tab refreshes
   */
  initializeAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      // Synchronize the apiClient instance explicitly with the active token state
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = await authApi.getCurrentUser();
      set({ user: userData, token, loading: false });
    } catch (error) {
      console.error('Automated session initialization failed:', error);

      // Clean up corrupt or expired storage profiles immediately
      localStorage.removeItem('token');
      delete apiClient.defaults.headers.common['Authorization'];
      set({ user: null, token: null, loading: false });
    }
  },

  /**
   * Dispatches explicit input criteria to trigger system credential verification
   */
  login: async (email, password) => {
    set({ loading: true });
    try {
      const { user, access_token } = await authApi.login(email, password);

      localStorage.setItem('token', access_token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      set({ user, token: access_token, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  /**
   * Propagates credential structures to register a unique profile account
   */
  register: async (name, email, password, passwordConfirmation) => {
    set({ loading: true });
    try {
      const { user, access_token } = await authApi.register(
        name,
        email,
        password,
        passwordConfirmation
      );

      localStorage.setItem('token', access_token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      set({ user, token: access_token, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  /**
   * External explicit pipeline for initializing authenticated user states via OAuth callback structures
   */
  loginWithSocialData: (userData, accessToken) => {
    localStorage.setItem('token', accessToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    set({ user: userData, token: accessToken, loading: false });
  },

  /**
   * Purges tracking records cleanly on both client memory and server instances
   */
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Remote logout handshake failed on server instance:', error);
    } finally {
      localStorage.removeItem('token');
      delete apiClient.defaults.headers.common['Authorization'];
      set({ user: null, token: null, loading: false });
    }
  }
}));