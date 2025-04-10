import React from 'react';
import './MyTickets.css';
import { Link } from 'react-router-dom'; // To navigate back to event page if needed
import { QRCodeCanvas } from 'qrcode.react';  // Correct named import



const MyTickets = ({ tickets }) => {
  return (
    <div className="my-tickets-page">
      <h1>My Tickets</h1>
      <div className="tickets-list">
        {tickets.map((ticket, index) => (
          <div key={index} className="ticket-card">
            <h3>{ticket.eventName}</h3>
            <p>VIP Tickets: {ticket.vipTickets}</p>
            <p>General Tickets: {ticket.generalTickets}</p>
            <div className="qr-code">
              {/* Here you can use a QR code library */}
              <QRCodeCanvas value={ticket.qrCode} size={128} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;
