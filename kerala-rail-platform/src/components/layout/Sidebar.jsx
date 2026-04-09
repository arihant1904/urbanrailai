import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../app/store';
import { Map, LayoutDashboard, Wrench, TrainTrack, Zap } from 'lucide-react';
import './Sidebar.scss';

const Sidebar = () => {
  const { sidebarOpen } = useStore();

  const navLinks = [
    { name: 'Live Tracker', path: '/', icon: <Map size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Train Explorer', path: '/explorer', icon: <TrainTrack size={20} /> },
    { name: 'AI Rerouting', path: '/rerouting', icon: <Zap size={20} /> },
    { name: 'Maintenance', path: '/maintenance', icon: <Wrench size={20} /> },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="nav-container">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="icon-wrapper">{link.icon}</div>
            <span className="link-text">{link.name}</span>
            <div className="active-indicator"></div>
          </NavLink>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <p className="system-status">System: Online</p>
      </div>
    </aside>
  );
};

export default Sidebar;
