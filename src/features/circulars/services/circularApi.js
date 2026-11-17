import apiClient from '../../../lib/apiClient';

export const circularApi = {
  /**
   * Fetch paginated list of job circulars with filters
   */
  async getCirculars(params = {}) {
    const response = await apiClient.get('/circulars', { params });
    return response.data;
  },

  /**
   * Fetch single circular detail
   */
  async getCircular(id) {
    const response = await apiClient.get(`/circulars/${id}`);
    return response.data;
  },

  /**
   * 1-Click Track: Import circular into user's Kanban board
   */
  async trackCircular(id) {
    const response = await apiClient.post(`/jobs/track-circular/${id}`);
    return response.data;
  }
};
