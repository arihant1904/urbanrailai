import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useStore } from '../../app/store';

const AINeuralMetrics = () => {
  const { theme } = useStore();
  const textColor = theme === 'dark-theme' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark-theme' ? '#334155' : '#e2e8f0';

  const data = [
    { subject: 'Accuracy', A: 98, fullMark: 100 },
    { subject: 'Latency', A: 85, fullMark: 100 },
    { subject: 'Reliability', A: 95, fullMark: 100 },
    { subject: 'Throughput', A: 90, fullMark: 100 },
    { subject: 'Neural Depth', A: 80, fullMark: 100 },
    { subject: 'Load Balance', A: 88, fullMark: 100 },
  ];

  return (
    <div className="glass-card chart-container" style={{ marginTop: '24px' }}>
      <div className="flex-between">
        <h3>Nexus AI Neural Performance Orbit</h3>
        <span style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', background: 'var(--accent-glow)', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
          HYPERPARAMETER STABILITY: OPTIMAL
        </span>
      </div>
      <div className="chart-wrapper" style={{ height: '400px', marginTop: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke={gridColor} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: textColor, fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Nexus AI"
              dataKey="A"
              stroke="var(--accent-primary)"
              fill="var(--accent-primary)"
              fillOpacity={0.3}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AINeuralMetrics;
