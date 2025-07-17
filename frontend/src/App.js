// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate  } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
// import Sidebar from './components/Sidebar';
// import Navbar from './components/Navbar';
// import MainContent from './components/MainContent';
import Signup from './pages/Signup';  
import Login from './pages/Login';  

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import CreateApp from './applications/CreateApp';
import Application from './applications/Application';  

import UpdateUser from './UpdateUser';

import Dashboard from './pages/Dashboard';

import Frequency from './frequency/Create_freq';

import FrequencyIndex from './frequency/Frequency';

import EmployeeCreate from './employee/CreateEmployee';

import Employee from './employee/IndexEmoloyee';
import HODs from './hod/HodIndex';

import Reviewer from './reviewer_dashboard/Dashboard'

import Logout from "./pages/Logout";


import User from './user/createUser';
import { useAuth } from "./auth/AuthContext";

import Audit from './audit/create_audit';
import RoleBasedDashboard from './pages/RoleBasedDashboard';
import AuditList from './audit/AuditList';
import UploadExcel from './excel/UploadExcel';
import ChangePassword from './reviewer_dashboard/changepass';
import UploadEmployees from './employee/UploadEmployees';
import UploadHods from './hod/UploadHod';
import CreateAdmin from './user/CreateAdmin';
import ExportCompletedReviews from './pages/ExportCompletedReviews';
import MyEmployees from './pages/MyEmployees';
import Toast from './components/Toast';
import axios from 'axios';
import SessionManager from './components/SessionManager';
import ActiveSessions from './pages/ActiveSessions';

function App() {
  return (
    <AuthProvider>
      <SessionManager />
      <Router>
        <Routes>
          <Route path="/change-password" element={
            <ProtectedRoute allowedRoles={["hod"]}>
              <ChangePassword />
            </ProtectedRoute>
          } />
          <Route path='/register' element={<Signup />}></Route>
          <Route path='/' element={<Login />}></Route>

          <Route path='/dashboard' element={
            <ProtectedRoute allowedRoles={["admin", "app_admin", "hod"]}>
              <RoleBasedDashboard/>
            </ProtectedRoute>
          }></Route>

          <Route path='/logout' element={
            <ProtectedRoute allowedRoles={["admin", "app_admin", "hod"]}>
              <Logout />
            </ProtectedRoute>
          }></Route>

          <Route path='/create_frequency' element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Frequency />
            </ProtectedRoute>
          }></Route>
          <Route path='/frequency' element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FrequencyIndex />
            </ProtectedRoute>
          }></Route>

          <Route path='/app' element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Application />
            </ProtectedRoute>}></Route>
          <Route path='/applicationcreate' element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateApp />
            </ProtectedRoute>}></Route>
          <Route path='/update' element={<UpdateUser />}></Route>
        
          <Route path='/employeescreate' element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EmployeeCreate />
            </ProtectedRoute>
          }></Route>

          <Route path='/employees' element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Employee />
            </ProtectedRoute>
           }></Route>

            <Route path='/hods' element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <HODs/>
              </ProtectedRoute>
           }></Route>

          {/* <Route path='/reviewer' element={<Reviewer />}></Route> */}
          <Route path='/hodcreate' element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <User />
            </ProtectedRoute>
          }></Route>

            <Route path='/pastReviews' element={
            <ProtectedRoute allowedRoles={["admin", "hod"]}>
              <AuditList />
            </ProtectedRoute>
            }></Route>

            <Route path='/myEmployees' element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MyEmployees />
            </ProtectedRoute>
            }></Route>

            <Route path='/uploadExcel' element={
            <ProtectedRoute allowedRoles={["admin", "app_admin"]}>
              <UploadExcel/>
            </ProtectedRoute>
            }></Route>
          {/* Commented out for app_admin: UploadEmployees should not be accessible to app_admin users */}
<Route path='/uploademployee' element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UploadEmployees/>
            </ProtectedRoute>
            }></Route>


<Route path='/uploadhod' element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UploadHods/>
            </ProtectedRoute>
            }></Route>
          <Route path='/create_audit' element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Audit />
            </ProtectedRoute>
          }></Route>
          <Route path='/create_admin' element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateAdmin />
            </ProtectedRoute>
          }></Route>
          <Route path='/exportCompletedReviews' element={
            <ProtectedRoute allowedRoles={["admin", "app_admin"]}>
              <ExportCompletedReviews />
            </ProtectedRoute>
          }></Route>
          <Route path='/active-sessions' element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ActiveSessions />
            </ProtectedRoute>
          }></Route>


        </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;
