import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles.css';
import { useAuth } from '../auth/AuthContext';
// Import icons from react-icons
import { FaThList, FaUsers, FaCalendarAlt, FaUserShield, FaClipboardCheck, FaHourglassHalf, FaCheckCircle, FaFileUpload, FaUserPlus, FaKey } from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to check if route is active
  const isActive = (path) => location.pathname === path;

  // Custom sidebar for app_admin
  if (user && user.role === 'app_admin') {
    return (
      <div className="sidebar">
        <ul>
          <li>
            <button className="sidebar-btn" onClick={() => navigate('/dashboard')}>
              <FaThList style={{ marginRight: 10 }} /> Pending Reviews Notification
            </button>
          </li>
          <li>
            <button className="sidebar-btn" onClick={() => navigate('/uploadExcel')}>
              <FaFileUpload style={{ marginRight: 10 }} /> Upload Review Excel
            </button>
          </li>
          <li>
            <button className="sidebar-btn" onClick={() => navigate('/exportCompletedReviews')}>
              <FaClipboardCheck style={{ marginRight: 10 }} /> Export Completed Reviews
            </button>
          </li>
          {/* Removed Create Employees button for app_admin */}
          <li>
            <button className="sidebar-btn" onClick={() => navigate('/uploademployee')}>
              <FaFileUpload style={{ marginRight: 10 }} /> Upload Employee
            </button>
          </li>
          {/* <li>
            <button className="sidebar-btn" onClick={() => navigate('/myEmployees')}>
              <FaUsers style={{ marginRight: 10 }} /> My Employees
            </button>
          </li> */}
        </ul>
      </div>
    );
  }

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="sidebar">
      <ul>
        {user.role === "admin" && (
          <li>
            <Link to="/frequency" className={isActive('/frequency') ? 'active' : ''}>
              <FaCalendarAlt style={{ marginRight: 10 }} /> Frequency
            </Link>
          </li>
        )}
        {user.role === "admin" && (
          <li>
            <Link to="/app" className={isActive('/app') ? 'active' : ''}>
              <FaThList style={{ marginRight: 10 }} /> Applications
            </Link>
          </li>
        )}
        {user.role === "admin" && (
          <li>
            <Link to="/hods" className={isActive('/hods') ? 'active' : ''}>
              <FaUserShield style={{ marginRight: 10 }} /> Reviewers
            </Link>
          </li>
        )}
        {user.role === "admin" && (
          <li>
            <Link to="/employees" className={isActive('/employees') ? 'active' : ''}>
              <FaUsers style={{ marginRight: 10 }} /> Employees
            </Link>
          </li>
        )}
        {user.role === "admin" && (
          <li>
            <Link to="/create_audit" className={isActive('/create_audit') ? 'active' : ''}>
              <FaClipboardCheck style={{ marginRight: 10 }} /> Create Review
            </Link>
          </li>
        )}
        <li>
          <Link to="/pastReviews" className={isActive('/pastReviews') ? 'active' : ''}>
            <FaHourglassHalf style={{ marginRight: 10 }} /> Pending Reviews
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
            <FaCheckCircle style={{ marginRight: 10 }} /> Completed Reviews
          </Link>
        </li>
        {user.role === "admin" && (
          <li>
            <Link to="/uploadExcel" className={isActive('/uploadExcel') ? 'active' : ''}>
              <FaFileUpload style={{ marginRight: 10 }} /> Upload Review Excel
            </Link>
          </li>
        )}
        {user.role === "admin" && (
          <li>
            <Link to="/uploademployee" className={isActive('/uploademployee') ? 'active' : ''}>
              <FaFileUpload style={{ marginRight: 10 }} /> Upload Employee
            </Link>
          </li>
        )}
        {/*
        {user.role === "admin" && (
          <li>
            <Link to="/hods" className={isActive('/hods') ? 'active' : ''}>
              <FaKey style={{ marginRight: 10 }} /> Change Password For Admin
            </Link>
          </li>
        )}
        */}
        {/* Change Password For Admin is commented out because it is currently broken */}
        {user.role === "hod" && (
          <li>
            <Link to="/change-password" className={isActive('/change-password') ? 'active' : ''}>
              <FaKey style={{ marginRight: 10 }} /> Change Password For HOD
            </Link>
          </li>
        )}
        {user.role === "admin" && (
          <li>
            <Link to="/create_admin" className={isActive('/create_admin') ? 'active' : ''}>
              <FaUserPlus style={{ marginRight: 10 }} /> Add New Admin
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;