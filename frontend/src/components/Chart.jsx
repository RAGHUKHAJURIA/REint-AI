import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';

const Chart = ({ data }) => {
  // Format the time for the X-axis and tooltips
  const formatTime = (timeString) => {
    try {
      const date = parseISO(timeString);
      return format(date, 'HH:mm\ndd/MM/yy');
    } catch (e) {
      return timeString;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md text-sm">
          <p className="font-semibold text-gray-700 mb-2">{format(parseISO(label), 'dd/MM/yyyy HH:mm')} (UTC)</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {entry.value != null ? `${entry.value.toLocaleString()} MW` : 'N/A'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-white border border-gray-100 rounded-xl shadow-sm">
        <p className="text-gray-500 font-medium">No generation data available for this range</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm h-[500px] w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Wind Generation (MW)</h3>
      <div className="h-full w-full pb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 40,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickMargin={12}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              label={{ value: 'Power (MW)', angle: -90, position: 'insideLeft', offset: -5, style: { textAnchor: 'middle', fill: '#4b5563', fontWeight: 500 } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '14px', fontWeight: 500 }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Generation"
              stroke="#3b82f6" // blue-500
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Forecast Generation"
              stroke="#10b981" // emerald-500
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive={true}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-2 text-sm text-gray-500 font-medium">
        Target Time End (UTC)
      </div>
    </div>
  );
};

export default Chart;
