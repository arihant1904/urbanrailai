import React from 'react';
import { useStore } from '../../app/store';
import { Moon, Sun, Menu, TrainFront } from 'lucide-react';
import './Navbar.scss';

const Navbar = () => {
  const { theme, toggleTheme, toggleSidebar } = useStore();

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="brand flex-center">
          <TrainFront className="brand-icon" size={28} />
          <h1 className="text-gradient">KRIP</h1>
        </div>
      </div>

      <div className="navbar-right">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'dark-theme' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="user-profile">
          <div className="avatar">A</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
