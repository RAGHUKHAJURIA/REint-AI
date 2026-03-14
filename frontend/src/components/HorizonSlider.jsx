import React from 'react';

const HorizonSlider = ({ horizon, onHorizonChange }) => {
  return (
    <div className="flex flex-col w-full sm:w-64">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor="horizon-slider" className="text-sm font-medium text-gray-700">
          Forecast Horizon: {horizon}h
        </label>
      </div>
      <input
        type="range"
        id="horizon-slider"
        min="0"
        max="48"
        step="1"
        value={horizon}
        onChange={(e) => onHorizonChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0h</span>
        <span>24h</span>
        <span>48h</span>
      </div>
    </div>
  );
};

export default HorizonSlider;
