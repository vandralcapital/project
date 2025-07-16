import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Toast from './Toast';
import { useAuth } from '../auth/AuthContext';

const SessionManager = () => {
  const { isAuthenticated, logout } = useAuth();
  const [toast, setToast] = useState(null);
  const timerRef = useRef();

  useEffect(() => {
    if (!isAuthenticated) return;
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('/session-time-left', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.secondsLeft <= 120 && res.data.secondsLeft > 0) {
          setToast({ message: 'You have 2 minutes remaining before logout. Please save your work.', type: 'info' });
        }
        if (res.data.secondsLeft <= 0) {
          setToast({ message: 'Session expired. You have been logged out.', type: 'error' });
          setTimeout(() => {
            logout();
            window.location.href = '/';
          }, 2000);
        }
      } catch (err) {
        setToast({ message: 'Session expired or invalid. You have been logged out.', type: 'error' });
        setTimeout(() => {
          logout();
          window.location.href = '/';
        }, 2000);
      }
    };
    timerRef.current = setInterval(checkSession, 1000);
    return () => clearInterval(timerRef.current);
  }, [isAuthenticated, logout]);

  if (!toast) return null;
  return <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />;
};

export default SessionManager; 