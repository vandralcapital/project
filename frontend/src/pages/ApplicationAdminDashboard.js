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
        const res = await fetch('/creating');
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
        {/* Removed welcome message and application name */}
      </div>
    </div>
  );
};

export default ApplicationAdminDashboard; 