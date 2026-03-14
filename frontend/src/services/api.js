import axios from 'axios';

// Get API base URL from Vite environment variables or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Fetch generation data from backend API
 * @param {string} start - Start date YYYY-MM-DD
 * @param {string} end - End date YYYY-MM-DD
 * @param {number} horizon - Forecast horizon in hours
 * @returns {Promise<Array>} Array of { time, actual, forecast }
 */
export const fetchGenerationData = async (start, end, horizon) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/generation`, {
      params: {
        start,
        end,
        horizon
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching generation data:', error);
    throw error;
  }
};
