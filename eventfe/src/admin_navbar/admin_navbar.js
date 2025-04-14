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
                src="path-to-your-logo.png"
                alt="EventEase Logo"
                className="navbar-logo"
              />
            </li>
            <li>
              <Link to="/admin_add">Add Admin</Link>
            </li>
            <li>
              <Link to="/create_event">Create Event</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;

