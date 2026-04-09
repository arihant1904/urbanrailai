import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTrainsData } from '../../hooks/useTrainsData';
import { useStore } from '../../app/store';

const DelayChart = () => {
  const { theme } = useStore();
  const { trains, loading } = useTrainsData();
  const textColor = theme === 'dark-theme' ? '#94a3b8' : '#64748b';

  // Group delays by routes (origins) just for a nice chart
  const dataMap = trains.reduce((acc, train) => {
    acc[train.origin] = (acc[train.origin] || 0) + train.delayMinutes;
    return acc;
  }, {});

  const data = Object.entries(dataMap).map(([name, delay]) => ({ name, delay }));

  return (
    <div className="glass-card chart-container">
      <h3>Cumulative Delay by Origin Station (Mins)</h3>
      <div className="chart-wrapper" style={{ height: '300px', marginTop: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark-theme' ? '#334155' : '#e2e8f0'} />
            <XAxis dataKey="name" stroke={textColor} fontSize={12} />
            <YAxis stroke={textColor} fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              itemStyle={{ color: 'var(--accent-primary)' }}
            />
            <Bar dataKey="delay" fill="var(--status-delayed)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DelayChart;
