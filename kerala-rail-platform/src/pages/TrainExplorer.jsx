import React, { useState } from 'react';
import TrainTable from '../components/trains/TrainTable';
import './Pages.scss';

const TrainExplorer = () => {
  return (
    <div className="page fade-in">
      <h2 className="title-header">Route & Schedule Explorer</h2>
      <div className="content-grid">
        <TrainTable />
      </div>
    </div>
  );
};

export default TrainExplorer;
