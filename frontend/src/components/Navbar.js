import React from 'react';
import '../styles.css';
import { useAuth } from '../auth/AuthContext';
const Navbar = () => {
    const { user } = useAuth();
  
    if (!user) {
      return <h2>Loading...</h2>;
    }
  return (
    <div className="navbar enhanced-navbar">
      <h1 className="navbar-title">Entitlement Review</h1>
      <div className="navbar-user-section">
        <div className="navbar-avatar">
          {user.name && (
            <span>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
          )}
        </div>
        <div className="navbar-user-info">
          <span className="navbar-welcome">Welcome, {user.name}!</span>
        </div>
        <a href='/logout' style={{textDecoration: "none"}}>
          <button className="logout-btn enhanced-logout-btn">Log out</button>
        </a>
      </div>
    </div>
  );
};

export default Navbar;