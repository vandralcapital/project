import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const ApplicationAdminDashboard = () => {
  const { user } = useAuth();
  const [appName, setAppName] = useState('');

  useEffect(() => {
    // Fetch the application for this admin
    const fetchApp = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/creating`);
        const apps = await res.json();
        const myApp = apps.find(app => app.adminEmail === user.email);
        setAppName(myApp ? myApp.appName : '');
      } catch (e) {
        setAppName('');
      }
    };
    fetchApp();
  }, [user]);

  return (
    <div className="app">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
          <h2 style={{ marginBottom: 10 }}>Welcome!</h2>
          <p style={{ marginBottom: 30, fontSize: 22 }}>Application: <b>{appName || '...'}</b></p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationAdminDashboard; 