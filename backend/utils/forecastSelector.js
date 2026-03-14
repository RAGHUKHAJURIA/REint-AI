/**
 * Forecast Selector Utility
 *
 * FORECAST HORIZON CONCEPT:
 * The forecast horizon defines how many hours before the target time
 * the forecast must have been published.
 */

/**
 * Select the appropriate forecast for a given target time and horizon.
 *
 * @param {Array} forecasts - Array of forecast objects with { startTime, publishTime, generation }
 * @param {string|Date} targetTime - The target time (settlement period start time)
 * @param {number} horizonHours - Forecast horizon in hours (0-48)
 * @returns {Object|null} The selected forecast object or null
 */
function selectForecast(forecasts, targetTime, horizonHours) {
  const target = new Date(targetTime);
  const horizonMs = horizonHours * 60 * 60 * 1000;

  // Compute cutoff time: targetTime - horizon
  const cutoff = new Date(target.getTime() - horizonMs);

  // Filter forecasts where publishTime <= cutoff
  const validForecasts = forecasts.filter((f) => {
    const publishTime = new Date(f.publishTime);
    return publishTime <= cutoff;
  });

  if (validForecasts.length === 0) {
    return null;
  }

  // Sort by publishTime descending to select the latest one
  validForecasts.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));

  return validForecasts[0];
}

module.exports = { selectForecast };
