const express = require('express');
const router = express.Router();
const { getActualGeneration, getForecastGeneration } = require('../services/bmrsService');
const { selectForecast } = require('../utils/forecastSelector');

router.get('/generation', async (req, res) => {
  try {
    const { start, end, horizon } = req.query;

    if (!start || !end || horizon === undefined) {
      return res.status(400).json({ error: 'Missing required query parameters: start, end, horizon' });
    }

    const horizonHours = parseFloat(horizon);
    if (isNaN(horizonHours) || horizonHours < 0 || horizonHours > 48) {
      return res.status(400).json({ error: 'Horizon must be a number between 0 and 48' });
    }

    // Fetch both datasets concurrently
    const [actuals, forecasts] = await Promise.all([
      getActualGeneration(start, end),
      getForecastGeneration(start, end)
    ]);

    // Group by startTime for easy merging
    const mergedDataMap = new Map();

    actuals.forEach(actual => {
      mergedDataMap.set(actual.startTime, {
        time: actual.startTime,
        actual: actual.generation,
        forecast: null
      });
    });

    // Ensure all startTimes from forecasts are also represented
    forecasts.forEach(forecast => {
      if (!mergedDataMap.has(forecast.startTime)) {
        mergedDataMap.set(forecast.startTime, {
           time: forecast.startTime,
           actual: null,
           forecast: null
        });
      }
    });

    // Compute forecast for each target time
    for (const [time, dataPoint] of mergedDataMap.entries()) {
      // Find all forecasts that are forecasting for this specific target time
      const forecastsForTarget = forecasts.filter(f => f.startTime === time);
      
      // Select the most recent forecast before the cutoff horizon
      const selectedForecast = selectForecast(forecastsForTarget, time, horizonHours);
      
      if (selectedForecast) {
        dataPoint.forecast = selectedForecast.generation;
      }
    }

    // Convert map to array and sort chronologically
    const result = Array.from(mergedDataMap.values()).sort((a, b) => new Date(a.time) - new Date(b.time));

    res.json(result);

  } catch (error) {
    console.error('API Error /generation:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
