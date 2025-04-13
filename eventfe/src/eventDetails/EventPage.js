import React, { useState, useEffect } from 'react';
import './EventPage.css';
import { useParams } from 'react-router-dom';
import { QRCode } from 'qrcode.react';

const EventPage = ({ setTickets }) => {
  const { id } = useParams();
  const [vipTickets, setVipTickets] = useState(0);
  const [generalTickets, setGeneralTickets] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [currentEvent, setCurrentEvent] = useState({
    id: 1,
    name: "Event Name",
    details: "Details for the event.",
    genre: "Music", 
    image: "/sample event bg.jpg",
    time: "2:00 PM, 10th April 2025",
    venue: "Event Hall 1, City Center",
    vipTicketPrice: 20,
    generalTicketPrice: 10,
  });

  const [showPopup, setShowPopup] = useState(false);  // State for showing popup

  useEffect(() => {
    const total = (vipTickets * currentEvent.vipTicketPrice) + (generalTickets * currentEvent.generalTicketPrice);
    setTotalAmount(total);
  }, [vipTickets, generalTickets, currentEvent]);

  const similarEvents = [
    { id: 2, name: "Event One", time: "4:00 PM, 30th April 2025", venue: "USC Shrine", genre:"Music", vipTicketPrice: 30, generalTicketPrice: 20 },
    { id: 3, name: "Event Two", time: "5:00 PM, 20th April 2025", venue: "Crypto Arena", genre:"Sports", vipTicketPrice: 40, generalTicketPrice: 30 },
    { id: 4, name: "Event Three", time: "6:00 PM, 24th April 2025", venue: "Santa Monica Pier", genre:"Art", vipTicketPrice: 50, generalTicketPrice: 80 }
  ];

  useEffect(() => {
    const event = similarEvents.find(e => e.id === parseInt(id));
    if (event) {
      setCurrentEvent(event);
    }
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
        <h2>Event Details</h2>
        <div className="event-time-venue">
          <p><strong>Time:</strong> {currentEvent.time}</p>
          <p><strong>Venue:</strong> {currentEvent.venue}</p>
          <p><strong>Genre:</strong> {currentEvent.genre}</p>
        </div>

        <div className="ticketing">
          <div className="ticket-type">
            <label>VIP Ticket</label>
            <input 
              type="number" 
              value={vipTickets} 
              onChange={(e) => setVipTickets(e.target.value)} 
              min="0" 
              max="10" 
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
              max="10" 
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
