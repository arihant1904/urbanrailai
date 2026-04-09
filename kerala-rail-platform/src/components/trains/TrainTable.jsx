import React, { useState, useEffect } from 'react';
import { useTrainsData } from '../../hooks/useTrainsData';
import { ArrowUpDown } from 'lucide-react';
import './TrainTable.scss';

const TrainTable = () => {
  const { trains, loading, fixTrainIssue } = useTrainsData();
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    setData(trains);
  }, [trains]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  const getAIAction = (train) => {
    if (train.isAIFixed) return { text: 'Fixed by AI ✅', class: 'maint-healthy', actionable: false };
    if (train.maintenanceStatus === 'Critical') return { text: '🚨 Route to Depot', class: 'maint-critical', actionable: true };
    if (train.delayMinutes > 30) return { text: '⚠️ Reroute Traffic', class: 'maint-minor-issue', actionable: true };
    if (train.delayMinutes > 0) return { text: '🔄 Increase Speed', class: 'text-secondary', actionable: true };
    return { text: '✅ Monitor Mode', class: 'maint-healthy', actionable: false };
  };

  const getOccupancyColor = (pct) => {
    if (pct < 50) return 'var(--status-healthy)';
    if (pct < 85) return 'var(--status-minor)';
    return 'var(--status-critical)';
  };

  return (
    <div className="glass-card table-container">
      <table className="krip-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('trainNumber')}>Train # <ArrowUpDown size={14} /></th>
            <th onClick={() => handleSort('trainName')}>Name <ArrowUpDown size={14} /></th>
            <th onClick={() => handleSort('origin')}>Origin <ArrowUpDown size={14} /></th>
            <th onClick={() => handleSort('destination')}>Destination <ArrowUpDown size={14} /></th>
            <th onClick={() => handleSort('occupancyPercentage')}>Strength <ArrowUpDown size={14} /></th>
            <th onClick={() => handleSort('status')}>Status <ArrowUpDown size={14} /></th>
            <th onClick={() => handleSort('delayMinutes')}>Delay <ArrowUpDown size={14} /></th>
            <th onClick={() => handleSort('maintenanceStatus')}>Health <ArrowUpDown size={14} /></th>
            <th>Nexus AI Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map(train => (
            <tr key={train.id} className="cursor-pointer">
              <td className="font-mono">{train.trainNumber}</td>
              <td className="font-bold">{train.trainName}</td>
              <td>{train.origin}</td>
              <td>{train.destination}</td>
              <td style={{ minWidth: '120px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '6px', background: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${train.occupancyPercentage}%`, height: '100%', background: getOccupancyColor(train.occupancyPercentage) }} />
                  </div>
                  <span style={{ fontSize: '0.85rem' }}>{train.occupancyPercentage}%</span>
                </div>
              </td>
              <td>
                <span className={`status-pill ${train.delayMinutes > 0 ? 'delayed' : 'ontime'}`}>
                  {train.status}
                </span>
              </td>
              <td className={train.delayMinutes > 0 ? 'text-critical font-bold' : 'text-ontime'}>
                {train.delayMinutes}m
              </td>
              <td>
                <span className={`maint-pill maint-${train.maintenanceStatus.replace(' ', '-').toLowerCase()}`}>
                  {train.maintenanceStatus}
                </span>
              </td>
              <td>
                {getAIAction(train).actionable ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); fixTrainIssue(train.id); }}
                    className={`maint-pill ${getAIAction(train).class}`}
                    style={{ whiteSpace: 'nowrap', opacity: 0.9, cursor: 'pointer', border: '1px solid currentColor', background: 'transparent' }}
                  >
                    {getAIAction(train).text} (Click to Exec)
                  </button>
                ) : (
                  <span className={`maint-pill ${getAIAction(train).class}`} style={{ whiteSpace: 'nowrap', opacity: 0.9 }}>
                    {getAIAction(train).text}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainTable;
