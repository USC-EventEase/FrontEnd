import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import "./navbar.css";
import { FormContextLogin } from "../login/FormContextLogin";
import Cookies from 'js-cookie';
import { verify, verifyAdmin } from '../api/auth';

const Navbar = () => {
  const { formDataLogin } = useContext(FormContextLogin);
  const [isAdmin, setIsAdmin] = useState(Cookies.get("type") === 'admin')
  const [isLoggedIn, setIsLoggedIn] = useState(Cookies.get("token"))

  const navigate = useNavigate();
  const checkAdmin = async () => {
    try {
      const response = await verifyAdmin();
      if (!response.ok) {
        setIsAdmin(false)
      }
      else{
        setIsAdmin(true)
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      logout();
    }
  };

  function logout() {
    Cookies.remove('token');
    Cookies.remove('userId');
    Cookies.remove('type');
    setIsLoggedIn(false)
    setIsAdmin(false)
    navigate('/');

  }
  const checkToken = async () => {
    try {
      const response = await verify();
      if (!response.ok) {
        logout(); // optionally clear cookies here too
        setIsLoggedIn(false)
      }
      else{
        setIsLoggedIn(true)
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      logout();
    }
  };
  useEffect(() => {
    checkToken();
    checkAdmin();
  }, []);
  

  return (
    <div className="navbar">
      <header>
        <nav className="flexSB">
          <ul className="flexSB">
            <li className="logo">
              <img
                src="/navbar_logo.png"
                alt="EventEase Logo"
                className="navbar-logo"
              />
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
            
            {isLoggedIn?
            <>
            <li>
              <Link to="/events">All Events</Link>
            </li>
            <li>
              <Link to="/myTickets">My Tickets</Link>
            </li>
            </>
            :<></>}
            {isAdmin?<>
            <li>
              <Link to="/create_event">Create Event</Link>
            </li>
            <li>
              <Link to="/admin/analytics">Event Analytics</Link>
            </li>
            </>
            :<></>}
            {isLoggedIn?
            <li>
              <Link to="/" onClick={logout}>Log out</Link>
            </li>:<>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            </>}
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
