import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { FormContextLogin } from "../login/FormContextLogin";

const Navbar = () => {
  const { formDataLogin } = useContext(FormContextLogin);

  return (
    <div className="navbar">
      <header>
        <nav className="flexSB">
          <ul class="flexSB">
            <li className="logo">
              <img
                src="path-to-your-logo.png"
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
              <Link to="/">Log out</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
