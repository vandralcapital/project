import { useAuth } from "../auth/AuthContext";
import Dashboard from "./Dashboard";
import Reviewer from "../reviewer_dashboard/Dashboard";
import React from 'react';
import { useNavigate } from "react-router-dom";

const RoleBasedDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <h2>Loading...</h2>;

  // Show dashboard for admin or hod
  if (user.role === "admin" || user.role === "hod") {
    return <Reviewer />;
  }

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h2 className="text-center">No Access available <br/> <span style={{fontSize: "22px"}}>Kindly contact IT support </span></h2>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 30px",
          background: "#167340",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "18px",
          cursor: "pointer"
        }}
        onClick={() => {
          logout();
          navigate("/logout");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default RoleBasedDashboard;
