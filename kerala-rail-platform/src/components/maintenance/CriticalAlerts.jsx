import React, { useState } from 'react';
import { useTrainsData } from '../../hooks/useTrainsData';
import { AlertTriangle, Hammer, CheckCircle2 } from 'lucide-react';

const CriticalAlerts = () => {
  const { trains, loading } = useTrainsData();
  const [dispatched, setDispatched] = useState(new Set());

  const handleDispatch = (id) => {
    setDispatched(prev => new Set(prev).add(id));
  };

  const criticalTrains = trains.filter(t => t.maintenanceStatus === 'Critical');

  if (criticalTrains.length === 0) return null;

  return (
    <div className="critical-alerts-container">
      {criticalTrains.map(train => (
        <div key={train.id} className="alert-box pulse-red">
          <div className="alert-icon">
            <AlertTriangle size={28} />
          </div>
          <div className="alert-content">
            <h4>CRITICAL MAINTENANCE REQUIRED</h4>
            <p>{train.trainName} ({train.trainNumber}) requires immediate mechanical inspection. Operating on {train.origin} - {train.destination} route.</p>
          </div>
          <div className="alert-action">
            <button 
               className="btn-dispatch"
               onClick={() => handleDispatch(train.id)}
               disabled={dispatched.has(train.id)}
               style={{ 
                 opacity: dispatched.has(train.id) ? 0.8 : 1, 
                 cursor: dispatched.has(train.id) ? 'not-allowed' : 'pointer', 
                 background: dispatched.has(train.id) ? 'var(--status-healthy)' : '',
                 color: dispatched.has(train.id) ? '#fff' : ''
               }}
            >
               {dispatched.has(train.id) ? <CheckCircle2 size={16}/> : <Hammer size={16}/>} 
               {dispatched.has(train.id) ? ' Crew En Route' : ' Dispatch Crew'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CriticalAlerts;
