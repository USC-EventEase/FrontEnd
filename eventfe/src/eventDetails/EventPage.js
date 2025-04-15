import React, { useState, useEffect } from 'react';
import './EventPage.css';
import { useParams } from 'react-router-dom';
import { QRCode } from 'qrcode.react';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../config';

const EventPage = ({ setTickets }) => {
  const { id } = useParams();
  const [vipTickets, setVipTickets] = useState(0);
  const [generalTickets, setGeneralTickets] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [currentEvent, setCurrentEvent] = useState({});

  const [showPopup, setShowPopup] = useState(false);  // State for showing popup

  useEffect(() => {
    const total = (vipTickets * currentEvent.vipTicketPrice) + (generalTickets * currentEvent.generalTicketPrice);
    setTotalAmount(total);
  }, [vipTickets, generalTickets, currentEvent]);

  const similarEvents = [
    { id: 2, name: "Event One", description: "One line description for the event.", time: "4:00 PM", date: "30th April 2025", venue: "USC Shrine", genre:"Music", vipTicketPrice: 30, generalTicketPrice: 20, totalVipTickets: 600, totalGeneralTickets: 900 },
    { id: 3, name: "Event Two", description: "One line description for the event.", time: "5:00 PM", date: "20th April 2025", venue: "Crypto Arena", genre:"Sports", vipTicketPrice: 40, generalTicketPrice: 30, totalVipTickets: 700, totalGeneralTickets: 1000 },
    { id: 4, name: "Event Three",description: "One line description for the event.", time: "6:00 PM", date: "24th April 2025", venue: "Santa Monica Pier", genre:"Art", vipTicketPrice: 50, generalTicketPrice: 80, totalVipTickets: 800, totalGeneralTickets: 1200 }
  ];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Adjust the URL to your API endpoint as needed.
        const response = await fetch(`${API_BASE_URL}/api/user/events/${id}`,{
          method: "GET",
          headers: {
            'Authorization': `Bearer ${Cookies.get("token")}`,
            'Content-Type': 'application/json',
          }});
        if (!response.ok) {
          console.log(response);
          throw new Error('Network response was not ok');
        }
        const eventData = await response.json();
        console.log(eventData)
        // setCurrentEvent(eventData);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };
    fetchEvent();
  }, [id]);
  const handleSimilarEventClick = (event) => {
    setCurrentEvent(event); 
    setVipTickets(0);        
    setGeneralTickets(0);
  };

  const handleRegister = () => {
    const newTicket = {
      eventName: currentEvent.name,
      time: currentEvent.time,
      date: currentEvent.date,
      venue: currentEvent.venue,
      genre: currentEvent.genre,
      vipTickets,
      generalTickets,
      qrCode: `${currentEvent.name}-${vipTickets}-${generalTickets}`,
    };
    setTickets((prevTickets) => [...prevTickets, newTicket]);
    console.log("New Ticket Registered:", newTicket);

    // Show success popup
    setShowPopup(true);
    
    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <div className="event-page">
      <section className="event-header">
        <h1 className="event-name">{currentEvent.name}</h1>
      </section>

      <section className="event-background">
        <img src={currentEvent.image} alt="Event Background" />
      </section>

      <section className="event-details">
      <p>{currentEvent.description}</p> 
        <div className="event-time-venue">
          <p><strong>Date:</strong> {currentEvent.date}</p>
          <p><strong>Time:</strong> {currentEvent.time}</p>
          <p><strong>Venue:</strong> {currentEvent.venue}</p>
          <p><strong>Genre:</strong> {currentEvent.genre}</p>
          <p><strong>Total VIP Tickets Available:</strong> {currentEvent.totalVipTickets}</p>
          <p><strong>Total General Tickets Available:</strong> {currentEvent.totalGeneralTickets}</p>
        </div>

        <div className="ticketing">
          <div className="ticket-type">
            <label>VIP Ticket</label>
            <input 
              type="number" 
              value={vipTickets} 
              onChange={(e) => setVipTickets(e.target.value)} 
              min="0" 
              max={currentEvent.totalVipTickets} 
            />
            <p>Price: ${currentEvent.vipTicketPrice}</p>
          </div>
          <div className="ticket-type">
            <label>General Ticket</label>
            <input 
              type="number" 
              value={generalTickets} 
              onChange={(e) => setGeneralTickets(e.target.value)} 
              min="0" 
              max={currentEvent.totalGeneralTickets} 
            />
            <p>Price: ${currentEvent.generalTicketPrice}</p>
          </div>
        </div>

        <div className="total-amount">
          <p><strong>Total Amount: </strong>${totalAmount}</p>
        </div>
      </section>

      <section className="register-button">
        <button onClick={handleRegister}>Register</button>
      </section>

      {/* Success Popup */}
      {showPopup && (
        <div className="popup">
          <p>Event registered successfully!</p>
        </div>
      )}

      <section className="similar-events">
        <h3>Similar Events</h3>
        <div className="similar-events-list">
          {similarEvents.map((event) => (
            <div key={event.id} className="event-card">
              <h4>{event.name}</h4>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
              <button onClick={() => handleSimilarEventClick(event)}>Book</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventPage;
