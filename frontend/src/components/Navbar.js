import React from 'react';
import '../styles.css';
import { useAuth } from '../auth/AuthContext';
const Navbar = () => {
    const { user } = useAuth();
  
    if (!user) {
      return <h2>Loading...</h2>;
    }
  return (
    <div className="navbar">
      <h1>Entitlement Review</h1>
      <div className="user-info">
        <span>Welcome, {user.name}!</span>
      </div>
      <div className="user-info">
        <a href='/logout' style={{textDecoration: "none"}}>
          <span className='text-white'>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' style={{background: "#167340", outline: "none"}}>
            Logout
            </button>
            </span>
        </a>
      </div>

    </div>
  );
};

export default Navbar;