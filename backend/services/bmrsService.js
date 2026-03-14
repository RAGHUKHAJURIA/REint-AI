const axios = require('axios');

const BMRS_BASE_URL = 'https://data.elexon.co.uk/bmrs/api/v1/datasets';

/**
 * Fetch actual generation data from FUELHH dataset
 */
async function getActualGeneration(startDate, endDate) {
  try {
    // FUELHH works best with /stream for historical settlement periods
    const response = await axios.get(`${BMRS_BASE_URL}/FUELHH/stream`, {
      params: {
        settlementDateFrom: startDate,
        settlementDateTo: endDate
      }
    });
    
    const data = response.data;
    if (!Array.isArray(data)) return [];

    return data
      .filter(item => item.fuelType === 'WIND')
      .map(item => ({
        startTime: item.startTime,
        generation: item.generation
      }));
  } catch (error) {
    console.error('Error fetching FUELHH via stream fallback to base:', error.message);
    try {
      // Fallback to base datasets endpoint if stream fails
      const response = await axios.get(`${BMRS_BASE_URL}/FUELHH`, {
        params: {
          publishDateTimeFrom: `${startDate}T00:00:00Z`,
          publishDateTimeTo: `${endDate}T23:59:59Z`,
          format: 'json'
        }
      });
      const data = response.data.data || response.data;
      if (!Array.isArray(data)) return [];
      return data.filter(i => i.fuelType === 'WIND').map(item => ({
        startTime: item.startTime,
        generation: item.generation
      }));
    } catch (e2) {
      console.error('Error fetching FUELHH via base endpoint:', e2.message);
      throw error;
    }
  }
}

/**
 * Fetch forecast generation data from WINDFOR dataset
 */
async function getForecastGeneration(startDate, endDate) {
  try {
    // WINDFOR historical data requires the base /datasets endpoint (non-stream)
    const response = await axios.get(`${BMRS_BASE_URL}/WINDFOR`, {
      params: {
        publishDateTimeFrom: `${startDate}T00:00:00Z`,
        publishDateTimeTo: `${endDate}T23:59:59Z`,
        format: 'json'
      }
    });

    const data = response.data.data || response.data;
    if (!Array.isArray(data)) return [];

    return data.map(item => ({
      startTime: item.startTime,
      publishTime: item.publishTime,
      generation: item.generation
    }));
  } catch (error) {
    console.error('Error fetching WINDFOR:', error.message);
    throw error;
  }
}

module.exports = {
  getActualGeneration,
  getForecastGeneration
};
