import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { FormContextLogin } from "../login/FormContextLogin";

const Navbar = () => {
  const { formDataLogin, setFormDataLogin } = useContext(FormContextLogin);

  const handleLogout = () => {
    // Clear the login data (you can implement the actual logout logic as needed)
    setFormDataLogin(null);
    // Optionally, redirect to login page after logging out
    window.location.href = "/";  // Redirecting to login page
  };

  return (
    <div className="navbar">
      <header>
        <nav className="flexSB">
          <ul className="flexSB">
            {/* Navbar Links in the middle */}
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/allEvents">{formDataLogin.username}</Link>
            </li>
            <li>
              <Link to="/myTickets">My Tickets</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
