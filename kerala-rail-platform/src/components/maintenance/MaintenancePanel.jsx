import React, { useState } from 'react';
import { useTrainsData } from '../../hooks/useTrainsData';
import { Calendar, Settings, CheckCircle2 } from 'lucide-react';
import './Maintenance.scss';

const MaintenancePanel = () => {
  const { trains, loading } = useTrainsData();
  const [scheduled, setScheduled] = useState(new Set());

  const handleSchedule = (id) => {
    setScheduled(prev => new Set(prev).add(id));
  };

  // Sort by nextServiceDueDays ascending (those due soonest appear first)
  const sortedMaintenance = [...trains].sort((a, b) => a.nextServiceDueDays - b.nextServiceDueDays);

  return (
    <div className="glass-card mt-xl padding-none">
      <div className="panel-header" style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ margin: 0 }}>Fleet Maintenance Log</h3>
      </div>
      <div className="maintenance-list">
        {sortedMaintenance.map((train) => (
          <div key={train.id} className="maintenance-item">
            <div className="train-info">
              <div className="flex-center icon-bg">
                <Settings size={20} />
              </div>
              <div>
                <h4>{train.trainName} ({train.trainNumber})</h4>
                <div className="stats-row">
                  <span>Mileage: {train.mileage.toLocaleString()} km</span>
                  <span>|</span>
                  <span>Last Service: {train.lastMaintenanceDaysAgo} days ago</span>
                </div>
              </div>
            </div>
            
            <div className="status-action">
              <div className="due-date">
                <Calendar size={14}/>
                <span className={train.nextServiceDueDays < 30 ? 'text-critical' : ''}>
                  Due in {train.nextServiceDueDays} days
                </span>
              </div>
              <button 
                className="schedule-btn"
                onClick={() => handleSchedule(train.id)}
                disabled={scheduled.has(train.id)}
                style={{ 
                  background: scheduled.has(train.id) ? 'var(--status-healthy)' : '', 
                  color: scheduled.has(train.id) ? '#fff' : '',
                  border: scheduled.has(train.id) ? 'none' : ''
                }}
              >
                {scheduled.has(train.id) ? 'Service Booked ✅' : 'Schedule Service'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenancePanel;
