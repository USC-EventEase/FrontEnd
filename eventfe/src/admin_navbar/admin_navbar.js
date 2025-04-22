import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./admin_navbar.css";
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
                src="/navbar_logo.png"
                alt="EventEase Logo"
                className="navbar-logo"
              />
            </li>
            <li>
              <Link to="/create_event">Create Event</Link>
            </li>
            <li>
              <Link to="/admin/analytics">Event Analytics</Link>
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
