import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { FormContextLogin } from "../login/FormContextLogin";

const Navbar = () => {
  const { formDataLogin } = useContext(FormContextLogin);

  return (
    <div class="navbar">
      <header>
        <nav className="flexSB">
          <ul class="flexSB">
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/allEvents">{formDataLogin.username}</Link>
            </li>
            <li>
              <Link to="myTickets">My Tickets</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
