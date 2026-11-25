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
      document.cookie = `careeros_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = await authApi.getCurrentUser();
      set({ user: userData, token, loading: false });
    } catch (error) {
      console.error('Automated session initialization failed:', error);

      // Clean up corrupt or expired storage profiles immediately
      localStorage.removeItem('token');
      document.cookie = 'careeros_token=; path=/; max-age=0; SameSite=Lax';
      delete apiClient.defaults.headers.common['Authorization'];
      set({ user: null, token: null, loading: false });
    }
  },

  /**
   * Dispatches explicit input criteria to trigger system credential verification
   */
  login: async (email, password) => {
    try {
      const { user, access_token } = await authApi.login(email, password);

      localStorage.setItem('token', access_token);
      document.cookie = `careeros_token=${access_token}; path=/; max-age=2592000; SameSite=Lax`;
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      set({ user, token: access_token });
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Propagates credential structures to register a unique profile account
   */
  register: async (name, email, password, passwordConfirmation) => {
    try {
      const response = await authApi.register(
        name,
        email,
        password,
        passwordConfirmation
      );

      // Strict Verification: Registration does NOT grant token directly
      return response;
    } catch (error) {
      throw error;
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const { user, access_token } = await authApi.verifyOtp(email, otp);

      localStorage.setItem('token', access_token);
      document.cookie = `careeros_token=${access_token}; path=/; max-age=2592000; SameSite=Lax`;
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      set({ user, token: access_token });
      return { success: true, user };
    } catch (error) {
      throw error;
    }
  },

  resendOtp: async (email) => {
    try {
      return await authApi.resendOtp(email);
    } catch (error) {
      throw error;
    }
  },

  /**
   * External explicit pipeline for initializing authenticated user states via OAuth callback structures
   */
  loginWithSocialData: (userData, accessToken) => {
    localStorage.setItem('token', accessToken);
    document.cookie = `careeros_token=${accessToken}; path=/; max-age=2592000; SameSite=Lax`;
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    set({ user: userData, token: accessToken, loading: false });
  },

  /**
   * Dispatches profile modifications to update personal user information
   */
  updateProfile: async (name, email, avatar = undefined) => {
    try {
      const response = await authApi.updateProfile(name, email, avatar);
      set((state) => ({ user: { ...state.user, ...response.user } }));
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Initiates password constraint update verification via backend
   */
  updatePassword: async (currentPassword, newPassword, newPasswordConfirmation) => {
    try {
      await authApi.updatePassword(currentPassword, newPassword, newPasswordConfirmation);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  updateApiKeys: async (openaiKey, geminiKey, groqKey) => {
    try {
      const response = await authApi.updateApiKeys(openaiKey, geminiKey, groqKey);
      set((state) => ({ user: { ...state.user, ...response.user } }));
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  updatePortfolio: async (portfolioData) => {
    try {
      const response = await authApi.updatePortfolio(portfolioData);
      set((state) => ({ user: { ...state.user, ...response.data } }));
      return { success: true, data: response.data };
    } catch (error) {
      throw error;
    }
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
      document.cookie = 'careeros_token=; path=/; max-age=0; SameSite=Lax';
      delete apiClient.defaults.headers.common['Authorization'];
      set({ user: null, token: null, loading: false });
    }
  }
}));