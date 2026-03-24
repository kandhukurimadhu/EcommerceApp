import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/**
 * Top navigation bar — shows logo, nav links, user info, and logout.
 * Admin users see an extra "Admin Panel" link.
 */
export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">BusyBrains<span className="logo-accent">Shop</span></span>
        </Link>

        {/* Desktop nav links */}
        <div className="navbar-links hide-mobile">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
            Dashboard
          </Link>
          {isAdmin && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
              Admin Panel
            </Link>
          )}
          <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
            Profile
          </Link>
        </div>

        {/* User info + logout */}
        <div className="navbar-right hide-mobile">
          <div className="user-chip">
            <div className="user-avatar">
              {user?.profilePicture
                ? <img src={user.profilePicture} alt={user.username} />
                : <span>{(user?.username || 'U')[0].toUpperCase()}</span>
              }
            </div>
            <div className="user-info">
              <span className="user-name">{user?.username}</span>
              <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
                {isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu fade-in">
          <Link to="/dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          {isAdmin && (
            <Link to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
          )}
          <Link to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>Profile</Link>
          <button className="mobile-link mobile-logout" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
