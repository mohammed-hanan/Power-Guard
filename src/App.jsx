import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
// Import pages below...
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import { EnergyProvider } from './context/EnergyContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="devices" element={<Devices />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function AppWithProvider() {
  return (
    <ThemeProvider>
      <EnergyProvider>
        <App />
      </EnergyProvider>
    </ThemeProvider>
  );
}

export default AppWithProvider;
