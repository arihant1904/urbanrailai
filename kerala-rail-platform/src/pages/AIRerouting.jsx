import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, ArrowRight, MapPin, Clock, History, CheckCircle } from 'lucide-react';
import './Pages.scss';

const STATIONS = [
  { name: 'Mangaluru', code: 'MAQ', pos: 0 },
  { name: 'Kasaragod', code: 'KGQ', pos: 15 },
  { name: 'Kannur', code: 'CAN', pos: 30 },
  { name: 'Kozhikode', code: 'CLT', pos: 45 },
  { name: 'Shoranur', code: 'SRR', pos: 60 },
  { name: 'Thrissur', code: 'TCR', pos: 70 },
  { name: 'Ernakulam', code: 'ERS', pos: 85 },
  { name: 'Kollam', code: 'QLN', pos: 95 },
  { name: 'Thiruvananthapuram', code: 'TVC', pos: 100 },
];

const AIRerouting = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [trainProgress, setTrainProgress] = useState(38); // Current position on the line
  
  const originalArrival = "22:45";
  const optimizedArrival = "21:30";
  const timeSaved = "75m";

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setIsFixed(true);
    }, 3000);
  };

  return (
    <div className="page fade-in">
      <div className="flex-between">
        <h2 className="title-header">AI Rerouting Intelligence</h2>
        <div className="flex-center" style={{ gap: '12px' }}>
          <span className="system-status-chip">
            <Zap size={14} fill="currentColor" /> CRUSTER AI: ACTIVE
          </span>
        </div>
      </div>

      <div className="content-grid">
        <div className="glass-card reroute-hero">
          <div className="reroute-header">
            <div className="train-meta">
              <h3>Malabar Express <span className="text-secondary">(16630)</span></h3>
              <p>Dynamic Route Optimization Sequence</p>
            </div>
            <div className="action-zone">
              {!isFixed ? (
                <button 
                  className={`optimize-btn ${isOptimizing ? 'loading' : ''}`} 
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                >
                  {isOptimizing ? <Cpu className="spin" /> : <Zap />}
                  {isOptimizing ? 'NEURAL COMPOSITION...' : 'EXECUTE AI REROUTE'}
                </button>
              ) : (
                <div className="fixed-badge">
                  <CheckCircle size={20} /> ROUTE OPTIMIZED
                </div>
              )}
            </div>
          </div>

          <div className="digital-track-container">
            <div className="track-labels">
              <span>{STATIONS[0].name} ({STATIONS[0].code})</span>
              <span>{STATIONS[STATIONS.length-1].name} ({STATIONS[STATIONS.length-1].code})</span>
            </div>
            
            <div className="digital-track">
              {/* The Line */}
              <div className="track-line"></div>
              
              {/* Station Markers */}
              {STATIONS.map((station, index) => (
                <div 
                  key={station.code} 
                  className="station-marker" 
                  style={{ left: `${station.pos}%` }}
                >
                  <div className="marker-dot"></div>
                  <span className="marker-label">{station.code}</span>
                </div>
              ))}

              {/* The Train Pointer */}
              <motion.div 
                className="train-pointer"
                animate={{ 
                  left: `${trainProgress}%`,
                  scale: [1, 1.2, 1],
                  boxShadow: ["0 0 10px var(--accent-primary)", "0 0 25px var(--accent-primary)", "0 0 10px var(--accent-primary)"] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="pointer-icon">
                  <Zap size={16} fill="currentColor" />
                </div>
                <div className="current-callout">
                  MALABAR EXP
                </div>
              </motion.div>
            </div>
          </div>

          <div className="reroute-stats-grid">
            <div className={`stat-box ${isFixed ? 'dimmed' : ''}`}>
              <div className="flex-center icon-circle red">
                <History size={20} />
              </div>
              <div className="stat-text">
                <label>Original ETA</label>
                <p>{originalArrival}</p>
              </div>
            </div>

            <div className="flex-center">
              <ArrowRight size={32} className={isFixed ? 'text-success' : 'text-secondary'} />
            </div>

            <div className={`stat-box highlighted ${isFixed ? 'fixed-glowing' : ''}`}>
              <div className="flex-center icon-circle blue">
                <Zap size={20} />
              </div>
              <div className="stat-text">
                <label>AI Projected ETA</label>
                <p>{isFixed ? optimizedArrival : originalArrival}</p>
                {isFixed && <span className="time-savings">SAVED: {timeSaved}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="ai-log-terminal">
          <div className="terminal-header">Neural Execution Log</div>
          <div className="terminal-body font-mono">
            <div className="log-line text-secondary">[SEC 14:28:42] Initializing Neural Route Array...</div>
            <div className="log-line text-secondary">[SEC 14:28:43] Loading historic congestion matrices for Kozhikode-Shoranur...</div>
            {isFixed && (
              <>
                <div className="log-line text-success">[SEC 14:28:45] AI Optimization Success: Path Rerouted via B-Line</div>
                <div className="log-line text-success">[SEC 14:28:45] Calculated Savings: 75 Minutes achieved by bypassing Shoranur Junction congestion</div>
                <div className="log-line text-success">[SEC 14:28:45] Command Sent: Manual Throttle Adjustment Authorized</div>
              </>
            )}
            {!isFixed && isOptimizing && (
              <div className="log-line animate-pulse">Scanning secondary branch lines for bottleneck relief...</div>
            )}
            <div className="log-line">_</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRerouting;
