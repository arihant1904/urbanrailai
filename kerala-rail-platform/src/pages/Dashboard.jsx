import React from 'react';
import KPISection from '../components/dashboard/KPISection';
import DelayChart from '../components/dashboard/DelayChart';
import MaintenanceChart from '../components/dashboard/MaintenanceChart';
import AINeuralMetrics from '../components/dashboard/AINeuralMetrics';
import './Pages.scss';

const Dashboard = () => {
  return (
    <div className="page fade-in">
      <h2 className="title-header">Analytics Overview</h2>
      <div className="content-grid">
        <KPISection />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <DelayChart />
          <MaintenanceChart />
        </div>
        <AINeuralMetrics />
      </div>
    </div>
  );
};

export default Dashboard;
