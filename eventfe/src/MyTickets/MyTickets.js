import React, { useEffect, useState } from 'react';
import './MyTickets.css';
import { QRCodeCanvas } from 'qrcode.react';
import { API_BASE_URL } from '../config';
import Cookies from 'js-cookie';

const MyTickets = () => {
  const [salt, setSalt] = useState(null);
  const [ticket, setTicket] = useState(null);

  const preprocessTickets = (rawTickets, salt) => {
    const finalList = [];

    rawTickets.forEach(ticket => {
      Object.entries(ticket.tickets).forEach(([type, info]) => {
        if (info.available_count > 0) {
          const qrPayload = `${API_BASE_URL}/api/admin/validate/${ticket._id}/${ticket.user_id}/${ticket.event_id._id}/${type}/${salt}`;
          finalList.push({
            eventName: ticket.event_id.event_name,
            time: ticket.event_id.event_time,
            location: ticket.event_id.event_location,
            date: ticket.event_id.event_date,
            type: type,
            qrCode: qrPayload,
            count: info.available_count,
          });
        }
      });
    });

    return finalList;
  };

  useEffect(() => {
    let pollIntervalId;

    const fetchSaltAndTickets = async () => {
      try {
        const token = Cookies.get("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const [saltRes, ticketsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/user/salt`, { method: 'GET', headers }),
          fetch(`${API_BASE_URL}/api/user/tickets`, { method: 'GET', headers }),
        ]);

        const saltData = await saltRes.json();
        const ticketsData = await ticketsRes.json();

        const newSalt = saltData?.Salt?.value;
        const newTickets = preprocessTickets(ticketsData?.tickets || [], newSalt);

        // 🔁 Only update state if something has actually changed
        let isSaltChanged = false;
        setSalt(prevSalt => {
          if (prevSalt !== newSalt) {
            isSaltChanged = true
            console.log("🧂 Salt updated:", newSalt);
            return newSalt;
          }
          return prevSalt;
        });

        setTicket(prev => {
          const changed = JSON.stringify(prev) !== JSON.stringify(newTickets);
          if (changed || isSaltChanged) {
            console.log("🎟 Ticket data changed. Updating QR...");
            return [...newTickets];
          }
          return prev;
        });
      } catch (error) {
        console.error('❌ Error fetching salt or tickets:', error);
      }
    };

    // Initial fetch
    fetchSaltAndTickets();

    // Start polling every 20 seconds
    pollIntervalId = setInterval(fetchSaltAndTickets, 20 * 1000);

    return () => {
      clearInterval(pollIntervalId);
    };
  }, []);

  return (
    <div className="my-tickets-page">
      <section className="my-tickets-header">
        <h1>My Tickets</h1>
      </section>

      <section className="tickets-list">
        {ticket?.map((sole, index) => (
          <div key={index} className="ticket-card">
            <div className="qr-code">
              <QRCodeCanvas value={sole.qrCode} size={128} />
            </div>
            <h3>{sole.eventName}</h3>
            <p><strong>Time:</strong> {sole.time}</p>
            <p><strong>Date:</strong> {sole.date}</p>
            <p><strong>Venue:</strong> {sole.location}</p>
            {sole.type === 'VIP'
              ? <p><strong>VIP Tickets: {sole.count}</strong></p>
              : <p><strong>General Tickets: {sole.count}</strong></p>}
          </div>
        ))}
      </section>
    </div>
  );
};

export default MyTickets;
