import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useStore } from '../../app/store';

const Layout = () => {
  const { theme } = useStore();

  useEffect(() => {
    // Set the theme on the root document element for global SCSS variables
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
