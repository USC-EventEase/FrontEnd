import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import Navbar from './navbar/navbar';
import Login from './login/Login';
import Signup from './login/Signup';
import { FormProviderLogin } from './login/FormContextLogin';
import Events from './events/Events.jsx'; // Adjust the path as per your project structure
import EventPage from './eventDetails/EventPage.js'; // Import the EventPage component
import MyTickets from './MyTickets/MyTickets.js';


function App() {
  const [tickets, setTickets] = useState([]);  // Store registered tickets globally
  return (
    <>
    <FormProviderLogin>
      <Router>
              <Routes>
                  <Route path='/' element={<Login />} />
                  <Route path='/signup' element={<Signup />} />
                  <Route path='/home' element={<><Navbar /><Events /></>} />
                  <Route path='/event/:id' element={<><Navbar /><EventPage setTickets={setTickets} /></>} />
                  <Route path='/myTickets' element={<><Navbar /><MyTickets tickets={tickets} /></>} /> 

              </Routes>
      </Router>
    </FormProviderLogin>
    </>
  );
}

export default App;