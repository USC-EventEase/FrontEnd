import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { FormContextLogin } from "../login/FormContextLogin";
import Cookies from "js-cookie";


const Navbar = () => {
    const { formDataLogin } = useContext(FormContextLogin);


  function logout() {
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("type");
  }

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
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/events">All Events</Link>
            </li>
            <li>
              <Link to="/myTickets">My Tickets</Link>
            </li>
            <li>
              <Link to="/" onClick={logout}>
                Log out
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
