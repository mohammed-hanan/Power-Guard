import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Cpu, Bell, Settings, Zap } from 'lucide-react';
import './Layout.css';

function Layout() {
  const NavItems = () => (
    <>
      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/devices" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <Cpu size={18} />
        <span>Devices</span>
      </NavLink>
      <NavLink to="/alerts" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <Bell size={18} />
        <span>Alerts</span>
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <Settings size={18} />
        <span>Settings</span>
      </NavLink>
    </>
  );

  return (
    <div className="layout">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-container">
          {/* Brand Logo */}
          <div className="brand">
            <div className="logo-icon">
              <Zap size={24} color="#fff" fill="#fff" />
            </div>
            <span className="brand-name">PowerGuard</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="nav-links desktop-nav">
            <NavItems />
          </div>

          {/* User Profile */}
          <div className="user-profile">
            <div className="avatar">D</div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="app-container">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (Rendered completely outside the blurred top-nav) */}
      <div className="nav-links mobile-nav">
        <NavItems />
      </div>
    </div>
  );
}

export default Layout;
