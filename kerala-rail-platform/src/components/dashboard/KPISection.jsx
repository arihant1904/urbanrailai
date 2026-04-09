import React from 'react';
import { Activity, Clock, Wrench, Users } from 'lucide-react';
import { useTrainsData } from '../../hooks/useTrainsData';
import './Dashboard.scss';

const KPISection = () => {
  const { trains, loading } = useTrainsData();

  const activeTrains = trains.length;
  const delayedTrains = trains.filter(t => t.delayMinutes > 0).length;
  const percentDelayed = activeTrains > 0 ? ((delayedTrains / activeTrains) * 100).toFixed(1) : 0;
  const criticalMaint = trains.filter(t => t.maintenanceStatus === 'Critical').length;
  const avgOccupancy = activeTrains > 0 ? (trains.reduce((acc, t) => acc + t.occupancyPercentage, 0) / activeTrains).toFixed(1) : 0;

  const kpis = [
    { title: 'Active Network', value: activeTrains, subtext: 'Trains currently running', icon: <Activity size={24} />, color: 'var(--accent-primary)' },
    { title: 'Delayed Services', value: `${percentDelayed}%`, subtext: `${delayedTrains} trains delayed`, icon: <Clock size={24} />, color: 'var(--status-minor)' },
    { title: 'Critical Maintenance', value: criticalMaint, subtext: 'Require immediate attention', icon: <Wrench size={24} />, color: 'var(--status-critical)' },
    { title: 'Avg Occupancy', value: `${avgOccupancy}%`, subtext: 'Across all active routes', icon: <Users size={24} />, color: 'var(--status-healthy)' },
  ];

  return (
    <div className="kpi-grid">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="glass-card kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: kpi.color + '20', color: kpi.color }}>
            {kpi.icon}
          </div>
          <div className="kpi-content">
            <h3>{kpi.value}</h3>
            <p className="kpi-title">{kpi.title}</p>
            <span className="kpi-subtext">{kpi.subtext}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPISection;
