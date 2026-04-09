import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TrainExplorer from './pages/TrainExplorer';
import Maintenance from './pages/Maintenance';
import AIRerouting from './pages/AIRerouting';
import './styles/index.scss';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="explorer" element={<TrainExplorer />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="rerouting" element={<AIRerouting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
