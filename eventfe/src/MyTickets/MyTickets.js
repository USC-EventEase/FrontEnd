import React from 'react';
import './MyTickets.css';
import { Link } from 'react-router-dom'; // To navigate back to event page if needed
import { QRCodeCanvas } from 'qrcode.react';  // Correct named import



const MyTickets = ({ tickets }) => {
  return (
    <div className="my-tickets-page">
      {/* Header Section */}
      <section className="my-tickets-header">
        <h1>My Tickets</h1>
      </section>
      {/* Background Image Section */}
      <section className="my-tickets-background">
        <img src="/sample event bg.jpg" alt="Background" />
      </section>
      {/* Tickets Section */}
      <section className="tickets-list">
        {tickets.map((ticket, index) => (
          <div key={index} className="ticket-card">
            <h3>{ticket.eventName}</h3>
            <p><strong>Time:</strong> {ticket.time}</p>
            <p><strong>Venue:</strong> {ticket.venue}</p>
            <p>VIP Tickets: {ticket.vipTickets}</p>
            <p>General Tickets: {ticket.generalTickets}</p>
            <div className="qr-code">
              {/* Display QR code for the ticket */}
              <QRCodeCanvas value={ticket.qrCode} size={128} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default MyTickets;
