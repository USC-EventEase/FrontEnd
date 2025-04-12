// src/events/EventPage.js
import React, { useState, useEffect } from "react";
import "./EventPage.css"; // Create a CSS file for styling
import { useParams } from "react-router-dom"; // Import useParams
import { QRCode } from "qrcode.react"; // Correct named import

const EventPage = ({ setTickets }) => {
  // Initialize state for ticket quantities
  const { id } = useParams(); // Get the event ID from the URL parameter
  const [vipTickets, setVipTickets] = useState(0);
  const [generalTickets, setGeneralTickets] = useState(0);
  const [myTickets, setMyTickets] = useState([]); // State to store tickets

  // Initial Event data
  const [currentEvent, setCurrentEvent] = useState({
    id: 1,
    name: "Event Name",
    details: "Details for the event.",
    image: "/sample event bg.jpg",
    time: "2:00 PM, 10th April 2025", // Placeholder Time
    venue: "Event Hall 1, City Center", // Placeholder Venue
  });

  // Simulating the API response for similar events
  const similarEvents = [
    {
      id: 2,
      name: "Event One",
      details: "Details for Event One",
      image: "path-to-image1.jpg",
      time: "4:00 PM, 30th April 2025",
      venue: "USC Shrine",
    },
    {
      id: 3,
      name: "Event Two",
      details: "Details for Event Two",
      image: "path-to-image2.jpg",
      time: "5:00 PM, 20th April 2025",
      venue: "Crypto Arena",
    },
    {
      id: 4,
      name: "Event Three",
      details: "Details for Event Three",
      image: "path-to-image3.jpg",
      time: "6:00 PM, 24th April 2025",
      venue: "Santa Monica Peir",
    },
    // Add more events as needed
  ];

  // Effect to simulate fetching event details based on event ID
  useEffect(() => {
    // For now, just use the id to get the correct event (using dummy data)
    const event = similarEvents.find((e) => e.id === parseInt(id));
    if (event) {
      setCurrentEvent(event); // Update current event details with the selected event
    }
  }, [id]); // This will run whenever the event ID changes

  // Handler for booking a similar event
  const handleSimilarEventClick = (event) => {
    setCurrentEvent(event); // Update current event details with the selected event
  };

  // Handler for register button
  const handleRegister = () => {
    const newTicket = {
      eventName: currentEvent.name,
      time: currentEvent.time, // Add time here
      venue: currentEvent.venue,
      vipTickets,
      generalTickets,
      qrCode: `${currentEvent.name}-${vipTickets}-${generalTickets}`, // This can be changed as per your need
    };
    // setMyTickets([...myTickets, newTicket]);
    setTickets((prevTickets) => [...prevTickets, newTicket]);
    console.log("New Ticket Registered:", newTicket);
    console.log("VIP Tickets:", vipTickets);
    console.log("General Tickets:", generalTickets);
  };

  return (
    <div className="event-page">
      {/* Event Logo or Name */}
      <section className="event-header">
        <h1 className="event-name">{currentEvent.name}</h1>
      </section>

      {/* Background Image */}
      <section className="event-background">
        <img src={currentEvent.image} alt="Event Background" />
      </section>

      {/* Event Details and Booking Section */}
      <section className="event-details">
        <h2>Event Details</h2>
        {/* Added Time and Venue */}
        <div className="event-time-venue">
          <p>
            <strong>Time:</strong> {currentEvent.time}
          </p>
          <p>
            <strong>Venue:</strong> {currentEvent.venue}
          </p>
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
          </div>
        </div>
      </section>

      {/* Register Button */}
      <section className="register-button">
        <button onClick={handleRegister}>Register</button>
      </section>

      {/* Similar Events Section */}
      <section className="similar-events">
        <h3>Similar Events</h3>
        <div className="similar-events-list">
          {/* Dynamically render similar events */}
          {similarEvents.map((event) => (
            <div key={event.id} className="event-card">
              <img src={event.image} alt={event.name} className="event-image" />
              <h4>{event.name}</h4>
              <p>{event.details}</p>
              <button onClick={() => handleSimilarEventClick(event)}>
                Book
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Footer Content</p>
      </footer>
    </div>
  );
};

export default EventPage;
