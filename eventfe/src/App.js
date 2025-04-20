import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Navbar from "./navbar/navbar1";
import Login from "./login/Login";
import Signup from "./login/Signup";
import { FormProviderLogin } from "./login/FormContextLogin";
import { FormProviderSignup } from "./login/FormContextSignup.jsx";
import Events from "./events/Events.jsx"; // Adjust the path as per your project structure
import EventPage from "./eventDetails/EventPage.js"; // Import the EventPage component
import MyTickets from "./MyTickets/MyTickets.js";
import Footer from "./footer/footer.js";
import Home from "./home/Home";
import Create_Event from "./Admin/create_event.js";
import Admin_Navbar from "./admin_navbar/admin_navbar.js";
import EventAnalytics from "./eventAnalytics/EventAnalytics";

function App() {
  const [tickets, setTickets] = useState([]); // Store registered tickets globally
  return (
    <>
    <FormProviderLogin>
      <FormProviderSignup>
        <Router>
              <Routes>
                  <Route path='/login' element={<Login />} />
                  <Route path='/signup' element={<Signup />} />
                  <Route path='/' element={<><Navbar /><Home /> <Footer/></>} />
                  <Route path='/events' element={<><Navbar/><Events/><Footer/></>}/>
                  <Route path='/event/:id' element={<><Navbar /><EventPage setTickets={setTickets} /><Footer/></>} />
                  <Route path='/myTickets' element={<><Navbar /><MyTickets tickets={tickets} /><Footer/></>} /> 
                  <Route path='/create_event' element={<><Navbar /><Create_Event /> <Footer/></>} />
                  <Route path='/update_event/:id' element={<><Navbar /><Create_Event /> <Footer/></>} />
                  <Route path="/admin/analytics" element={<><Navbar /><EventAnalytics /> <Footer /></>}/>
              </Routes>
      </Router>
      </FormProviderSignup>
    </FormProviderLogin>
    </>
  );
}

export default App;
