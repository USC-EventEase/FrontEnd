import React, { useState, useEffect } from 'react';
import './EventPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import { get_event, register_event } from '../api/user_events';
import { get_recommendations } from '../api/ai_events';

const EventPage = ({ setTickets }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vipTickets, setVipTickets] = useState(0);
  const [generalTickets, setGeneralTickets] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const total = (vipTickets * currentEvent.tickets?.VIP?.current_price || 0) +
                  (generalTickets * currentEvent.tickets?.Regular?.current_price || 0);
    setTotalAmount(total);
  }, [vipTickets, generalTickets, currentEvent]);

  const fetchRecommendedEvents = async (recData) => {
    try {
      const fetchPromises = recData.map(recItem => 
        get_event(recItem.event_id).then(res => res.data)
      );
      const eventsData = await Promise.all(fetchPromises);
      setRecommendedEvents(eventsData)
    } catch (err) {
      console.error('Error fetching recommended events:', err);
    }
  };

  const fetchEvent = async () => {
    try {
      const response = await get_event(id);
      setCurrentEvent(response.data);
    } catch (err) {
      console.error('Error fetching event data:', err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await get_recommendations(id);
      await fetchRecommendedEvents(response.data);

    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  useEffect(() => {
    fetchEvent();
    fetchRecommendations();
  }, [id]);

  const handleRegister = async () => {
    if (Number(vipTickets) <= 0 && Number(generalTickets) <= 0) {
      alert("Please select at least one ticket.");
      return;
    }
    try {
      await register_event(
        id,
        vipTickets,
        currentEvent.tickets?.VIP?.current_price,
        generalTickets,
        currentEvent.tickets?.Regular?.current_price
      );
      setShowPopup(true);
      setVipTickets(0);
      setGeneralTickets(0);
      setTotalAmount(0);
      await fetchEvent();
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      console.error('Error registering:', err);
    }
  };

  return (
    <div className="event-page">
      <section className="event-header">
        <h1 className="event-name">{currentEvent.event_name}</h1>
      </section>

      <section className="event-content">
  <div className="event-block event-background">
    <img src={currentEvent.event_image} alt="Event" />
  </div>

  <div className="event-block event-details">
    <p><strong>Genre:</strong> {currentEvent.event_genre}</p>
    <p><strong>Date:</strong> {currentEvent.event_date}</p>
    <p><strong>Time:</strong> {currentEvent.event_time}</p>
    <p><strong>Venue:</strong> {currentEvent.event_location}</p>
    <p><strong>Total VIP Tickets Available:</strong> {currentEvent.tickets?.VIP?.available_tickets}</p>
    <p><strong>Total General Tickets Available:</strong> {currentEvent.tickets?.Regular?.available_tickets}</p>
  </div>

  <div className="event-block ticketing">
    <div className="ticket-type">
      <label>VIP Ticket</label>
      <input 
        type="number" 
        value={vipTickets}
        onChange={(e) => setVipTickets(e.target.value)}
        min="0"
        max={currentEvent.tickets?.VIP?.available_tickets}
      />
      <p>Price: ${currentEvent.tickets?.VIP?.current_price}</p>
    </div>

    <div className="ticket-type">
      <label>General Ticket</label>
      <input 
        type="number" 
        value={generalTickets}
        onChange={(e) => setGeneralTickets(e.target.value)}
        min="0"
        max={currentEvent.tickets?.Regular?.available_tickets}
      />
      <p>Price: ${currentEvent.tickets?.Regular?.current_price}</p>
    </div>

    <div className="total-amount">
      <p><strong>Total Amount:</strong> ${totalAmount}</p>
    </div>
  </div>
</section>


      <section className="register-button">
        <button onClick={handleRegister}>Register</button>
      </section>

      {showPopup && (
        <div className="popup">
          <p>Event registered successfully!</p>
        </div>
      )}

      {recommendedEvents.length>0?
        <section className="similar-events">
          <h3>Similar Events</h3>
          <div className="similar-events-list">
            {recommendedEvents.map(event => (
              <div key={event._id} className="event-card">
                <h4>{event.event_name}</h4>
                <p>Time: {event.event_time}</p>
                <p>Date: {event.event_date}</p>
                <p>Venue: {event.event_location}</p>
                <button onClick={() => navigate(`/event/${event._id}`)}>View</button>
              </div>
            ))}
          </div>
        </section>
        :<></>
      }
    </div>
  );
};

export default EventPage;
