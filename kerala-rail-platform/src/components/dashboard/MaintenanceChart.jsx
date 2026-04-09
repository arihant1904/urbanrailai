import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTrainsData } from '../../hooks/useTrainsData';
import { useStore } from '../../app/store';

const MaintenanceChart = () => {
  const { theme } = useStore();
  const { trains, loading } = useTrainsData();

  const statusCount = trains.reduce((acc, train) => {
    acc[train.maintenanceStatus] = (acc[train.maintenanceStatus] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

  const COLORS = {
    'Healthy': 'var(--status-healthy)',
    'Minor Issue': 'var(--status-minor)',
    'Critical': 'var(--status-critical)'
  };

  return (
    <div className="glass-card chart-container">
      <h3>Fleet Health Distribution</h3>
      <div className="chart-wrapper" style={{ height: '300px', marginTop: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MaintenanceChart;
