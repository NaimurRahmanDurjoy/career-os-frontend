import apiClient from '../../../lib/apiClient';

/**
 * Service layer abstraction handling direct HTTP operations for the Authentication domain
 */
export const authApi = {
  /**
   * Submits traditional user login credentials to the REST backend
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} Object containing user instance and access_token
   */
  async login(email, password) {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
  },

  /**
   * Registers a new account profile with traditional credentials
   * @param {string} name 
   * @param {string} email 
   * @param {string} password 
   * @param {string} passwordConfirmation 
   * @returns {Promise<Object>} Object containing user instance and access_token
   */
  async register(name, email, password, passwordConfirmation) {
    const response = await apiClient.post('/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  },

  /**
   * Revokes the current active authentication token on the backend server
   * @returns {Promise<Object>} Success message acknowledgement
   */
  async logout() {
    const response = await apiClient.post('/logout');
    return response.data;
  },

  /**
   * Retrieves the authenticated user profile based on the current Bearer token
   * @returns {Promise<Object>} Authenticated user data payload
   */
  async getCurrentUser() {
    const response = await apiClient.get('/user');
    return response.data;
  },

  /**
   * Trades the temporary OAuth callback code received from a social provider for a valid Sanctum token
   * @param {string} provider - Explicit provider name (e.g., 'google', 'facebook', 'linkedin')
   * @param {string} searchParams - The query string payload enclosing code/state tokens from the provider
   * @returns {Promise<Object>} Object containing logged-in user instance and access_token
   */
  async handleSocialCallback(provider, searchParams) {
    const response = await apiClient.get(`/auth/${provider}/callback${searchParams}`);
    return response.data;
  }
};