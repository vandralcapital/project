import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { Component }  from 'react';


const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/"); // Redirect to main login page after logout
    window.location.reload(); // Force reload to reset state
  }, [logout, navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
