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
import Footer from './footer/footer.js';
import Home from "./home/Home";
import Admin_add from "./Admin/admin_add.js";
import Create_Event from "./Admin/create_event.js";
import Admin_Navbar from './admin_navbar/admin_navbar.js';


function App() {
  const [tickets, setTickets] = useState([]); // Store registered tickets globally
  return (
    <>
    <FormProviderLogin>
      <Router>
              <Routes>
                  <Route path='/' element={<Login />} />
                  <Route path='/signup' element={<Signup />} />
                  <Route path='/home' element={<><Navbar /><Home /> <Footer/></>} />
                  <Route path='/events' element={<><Navbar/><Events/><Footer/></>}/>
                  <Route path='/event/:id' element={<><Navbar /><EventPage setTickets={setTickets} /><Footer/></>} />
                  <Route path='/myTickets' element={<><Navbar /><MyTickets tickets={tickets} /><Footer/></>} /> 
                  <Route path='/admin_add' element={<><Admin_Navbar/><Admin_add/><Footer/></>} />
                  <Route path='/create_event' element={<><Admin_Navbar/><Create_Event/><Footer/></>} />
              </Routes>
      </Router>
    </FormProviderLogin>
    </>
  );
}

export default App;
