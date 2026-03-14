import React, { useState, useEffect, useCallback } from 'react';
import { Wind, AlertCircle, Loader2 } from 'lucide-react';
import DateRangePicker from '../components/DateRangePicker';
import HorizonSlider from '../components/HorizonSlider';
import Chart from '../components/Chart';
import { fetchGenerationData } from '../services/api';

const Dashboard = () => {
  // Default values based on requirements
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-01-03');
  const [horizon, setHorizon] = useState(4);
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!startDate || !endDate) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const fetchedData = await fetchGenerationData(startDate, endDate, horizon);
      setData(fetchedData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load forecast data. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, horizon]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Wind className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Wind Forecast Monitoring App</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <DateRangePicker 
              startDate={startDate} 
              endDate={endDate} 
              onStartDateChange={setStartDate} 
              onEndDateChange={setEndDate} 
            />
            
            <HorizonSlider 
              horizon={horizon} 
              onHorizonChange={setHorizon} 
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
              <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <span className="font-medium text-gray-700">Loading data...</span>
              </div>
            </div>
          )}
          
          <Chart data={data} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
