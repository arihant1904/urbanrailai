import React from 'react';
import MaintenancePanel from '../components/maintenance/MaintenancePanel';
import CriticalAlerts from '../components/maintenance/CriticalAlerts';
import './Pages.scss';

const Maintenance = () => {
  return (
    <div className="page fade-in">
      <h2 className="title-header">Fleet Maintenance & Alerts</h2>
      <div className="content-grid">
        <CriticalAlerts />
        <MaintenancePanel />
      </div>
    </div>
  );
};

export default Maintenance;
