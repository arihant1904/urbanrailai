import React from 'react';
import LiveTracker from '../components/trains/LiveTracker';
import './Pages.scss';

const Home = () => {
  return (
    <div className="page fade-in">
      <h2 className="title-header">Real-Time Train Tracker</h2>
      <div className="content-grid">
        <LiveTracker />
      </div>
    </div>
  );
};

export default Home;
