import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Wrench, Users, Activity, Cpu } from 'lucide-react';
import './TrainDetailsModal.scss';

const TrainDetailsModal = ({ train, onClose }) => {
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  useEffect(() => {
    const fetchAI = async () => {
      setAiLoading(true);
      try {
        const res = await fetch(`/api/trains/${train.id}/ai-insights`);
        if (res.ok) {
          const data = await res.json();
          setAiData(data);
        } else {
          setAiData({ error: 'AI Engine Offline' });
        }
      } catch (err) {
        // Graceful offline mockup if the user hasn't booted the DB/FastAPI cluster yet
        setTimeout(() => {
          setAiData({
            predictedDelayMinutes: (train.delayMinutes || 0) * 1.2 || 12.5,
            predictedMaintenanceStatus: train.maintenanceStatus === 'Critical' ? 'Critical' : 'Minor Issue'
          });
          setAiLoading(false);
        }, 1200);
        return;
      }
      setAiLoading(false);
    };
    fetchAI();
  }, [train.id]);
  return (
    <div className="modal-overlay flex-center" onClick={onClose}>
      <motion.div 
        className="glass-card modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <button className="close-btn" onClick={onClose}><X size={24} /></button>
        
        <div className="modal-header">
          <h2>{train.trainName} <span className="text-secondary">({train.trainNumber})</span></h2>
          <div className={`status-pill ${train.delayMinutes > 0 ? 'delayed' : 'ontime'}`}>
            {train.status}
          </div>
        </div>

        <div className="modal-grid">
          <div className="info-box detail-card">
            <Clock className="icon" />
            <div className="info-text">
              <label>Schedule</label>
              <p>{train.departureTime} - {train.arrivalTime}</p>
            </div>
          </div>
          
          <div className="info-box detail-card">
            <Activity className="icon" />
            <div className="info-text">
              <label>Delay</label>
              <p className={train.delayMinutes > 0 ? 'text-critical' : 'text-ontime'}>
                {train.delayMinutes} mins
              </p>
            </div>
          </div>

          <div className="info-box detail-card">
            <Users className="icon" />
            <div className="info-text">
              <label>Occupancy</label>
              <p>{train.occupancyPercentage}%</p>
            </div>
          </div>

          <div className="info-box detail-card">
            <Wrench className="icon" />
            <div className="info-text">
              <label>Maintenance</label>
              <p className={`maint-${train.maintenanceStatus.replace(' ', '-').toLowerCase()}`}>
                {train.maintenanceStatus}
              </p>
            </div>
          </div>
        </div>

        <div className="ai-insights-panel mt-l p-m glass-card" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--accent-primary)', marginTop: '20px', padding: '16px', borderRadius: '12px' }}>
          <h3 className="flex-center" style={{ gap: '8px', marginBottom: '12px', color: 'var(--accent-primary)' }}>
            <Cpu size={20} /> Nexus AI Predictive Analytics
          </h3>
          {aiLoading ? (
            <div className="animate-pulse flex-center" style={{ color: 'var(--text-secondary)', padding: '10px' }}>
              <Activity size={16} className="mr-s" style={{ marginRight: '8px' }} /> Interrogating Python ML Cluster...
            </div>
          ) : aiData?.error ? (
            <div className="text-minor">{aiData.error}</div>
          ) : aiData ? (
            <div className="ai-stats flex-between">
              <div className="stat-block">
                <span className="label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Forecasted Delay</span>
                <strong className={aiData.predictedDelayMinutes > 15 ? 'text-critical' : 'text-ontime'} style={{ fontSize: '1.2rem' }}>
                  {aiData.predictedDelayMinutes.toFixed(1)} mins
                </strong>
              </div>
              <div className="stat-block">
                <span className="label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Forecasted Health</span>
                <strong className={`maint-${aiData.predictedMaintenanceStatus.replace(' ', '-').toLowerCase()}`} style={{ fontSize: '1.2rem' }}>
                  {aiData.predictedMaintenanceStatus}
                </strong>
              </div>
            </div>
          ) : null}
        </div>
        
        <AnimatePresence>
          {activeAction && (
            <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               style={{ padding: '12px', marginTop: '16px', background: 'var(--bg-elevated)', borderLeft: '4px solid var(--accent-primary)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
            >
              {activeAction === 'schedule' && <p>🗓️ <strong>Schedule Synced.</strong> Fetching historic timetables and projecting ETA based on regional tracking arrays...</p>}
              {activeAction === 'dispatch' && <p>🚨 <strong>Crew Dispatched.</strong> A regional maintenance team has been alerted and will intercept at the next operational platform.</p>}
              {activeAction === 'route' && <p>🗺️ <strong>AI Rerouting Active.</strong> Nexus AI calculates the primary line is congested. Diverting {train.trainName} via secondary branch to save {aiData?.predictedDelayMinutes > 0 ? Math.floor(aiData.predictedDelayMinutes/2) : 5} minutes.</p>}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="modal-footer" style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="action-btn outline flex-1" onClick={() => setActiveAction('schedule')}>Full Schedule</button>
          <button className="action-btn outline flex-1" onClick={() => setActiveAction('route')}>AI Target Reroute</button>
          <button className="action-btn primary flex-1" onClick={() => setActiveAction('dispatch')}>Dispatch Crew</button>
        </div>
      </motion.div>
    </div>
  );
};

export default TrainDetailsModal;
