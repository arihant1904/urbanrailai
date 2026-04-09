import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Train, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { useTrainsData } from '../../hooks/useTrainsData';
import TrainDetailsModal from './TrainDetailsModal';
import './LiveTracker.scss';

const LiveTracker = () => {
  const { trains, loading, error } = useTrainsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrain, setSelectedTrain] = useState(null);

  if (loading) {
    return (
      <div className="live-tracker flex-center glass-card" style={{ height: '400px' }}>
        <h3 className="animate-pulse">Loading Live Telemetry from Central Cluster...</h3>
      </div>
    );
  }

  const filteredTrains = trains.filter(t => 
    t.trainName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.trainNumber.toString().includes(searchTerm)
  );

  const getProgress = (train) => {
    // Mock progress calculation
    const [depH, depM] = train.departureTime.split(':').map(Number);
    const [arrH, arrM] = train.arrivalTime.split(':').map(Number);
    const totalMins = (arrH * 60 + arrM) - (depH * 60 + depM);
    // Let's just create a dynamic looking progress based on ID for demo purposes
    return Math.min(100, Math.max(10, (parseInt(train.id) % 100)));
  };

  return (
    <div className="live-tracker">
      <div className="glass-card search-section">
        <div className="search-bar">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by Train Number or Name (e.g. 12393 or Parasuram)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="train-list fade-in">
        <AnimatePresence>
          {filteredTrains.map((train) => (
            <motion.div 
              key={train.id}
              className="glass-card train-card cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedTrain(train)}
            >
              <div className="train-header">
                <div>
                  <h3>{train.trainName} <span className="train-number">({train.trainNumber})</span></h3>
                  <div className="status-badge flex-center" data-status={train.status === 'On Time' ? 'success' : 'warning'}>
                    {train.status === 'On Time' ? <Clock size={14} /> : <AlertTriangle size={14} />}
                    {train.status} {train.delayMinutes > 0 && `(+${train.delayMinutes}m)`}
                  </div>
                </div>
                <div className="train-platform">PF-{train.platformNumber}</div>
              </div>

              <div className="progress-container">
                <div className="stations flex-between">
                  <div className="station origin">
                    <MapPin size={16} />
                    <span>{train.origin}</span>
                    <small>{train.departureTime}</small>
                  </div>
                  <div className="station current">
                    <Train size={24} className="current-icon animated-train" />
                    <span>{train.currentLocation}</span>
                  </div>
                  <div className="station dest">
                    <MapPin size={16} />
                    <span>{train.destination}</span>
                    <small>{train.arrivalTime}</small>
                  </div>
                </div>
                <div className="progress-bar-bg">
                  <motion.div 
                    className={`progress-bar-fill ${train.delayMinutes > 15 ? 'delayed' : 'ontime'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgress(train)}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
          {filteredTrains.length === 0 && (
            <div className="no-results">No trains found for your search.</div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedTrain && (
          <TrainDetailsModal train={selectedTrain} onClose={() => setSelectedTrain(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveTracker;
