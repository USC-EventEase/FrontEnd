import React, { useState, useEffect } from 'react';
import './EventPage.css';
import { useParams } from 'react-router-dom';
import { QRCode } from 'qrcode.react';
import Cookies from 'js-cookie';
import { API_BASE_URL, AI_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';


const EventPage = ({ setTickets }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vipTickets, setVipTickets] = useState(0);
  const [generalTickets, setGeneralTickets] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [rec, setRec] = useState(null);
  const [recommendedEvents, setRecommendedEvents] = useState(null);

  const [currentEvent, setCurrentEvent] = useState({});

  const [showPopup, setShowPopup] = useState(false);  // State for showing popup

  useEffect(() => {
    const total = (vipTickets * currentEvent.tickets?.VIP?.current_price) +
              (generalTickets * currentEvent.tickets?.Regular?.current_price);

    setTotalAmount(total);
  }, [vipTickets, generalTickets, currentEvent]);

  const fetchRecommendedEvents = async (recData) => {
    try {
      // Create an array of fetch promises using the event_id from each recommendation.
      const fetchPromises = recData.map((recItem) => {
        // Adjust the URL to match your API. For example:
        return fetch(`${API_BASE_URL}/api/user/events/${recItem.event_id}`,{
          method: "GET",
          headers: {
            'Authorization': `Bearer ${Cookies.get("token")}`,
            'Content-Type': 'application/json',
          }})
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Network response was not ok for event ${recItem.event_id}`);
            }
            return response.json();
          });
      });
      
      // Wait until all fetch calls complete
      const eventsData = await Promise.all(fetchPromises);
      // console.log('Recommended event details:', eventsData);
      // Now, for example, you might store these details in your state.
      setRecommendedEvents(eventsData);
    } catch (error) {
      console.error('Error fetching recommended events:', error);
    }
  };
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
        throw new Error('Network response was not ok');
      }
      const eventData = await response.json();
      // console.log(eventData);
      setCurrentEvent(eventData);
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };
  const fetchRecommendations = async () => {
    try {
      // Adjust the URL to your API endpoint as needed.
      const response = await fetch(`${AI_BASE_URL}/api/get_recommendations?eventId=${id}`,{
        method: "GET"});
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const eventData = await response.json();
      // console.log(eventData);
      setRec(eventData);
      fetchRecommendedEvents(eventData);

    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };

  useEffect(() => {
    fetchEvent();
    fetchRecommendations();

  }, [id]);


  const handleRegister = async () => {
    await fetch(`${API_BASE_URL}/api/user/event/register`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${Cookies.get("token")}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_id: id,
        tickets:{
          VIP: { count: vipTickets, price: currentEvent.tickets?.VIP?.current_price },
          Regular: { count: generalTickets, price: currentEvent.tickets?.Regular?.current_price }
        }
      }),
    })
      .then(response => response.json())
      // .then(data => console.log(data))
      .catch(err => console.error(err));
    console.log("New Ticket Registered");

    // Show success popup
    setShowPopup(true);
    setVipTickets(0);
    setGeneralTickets(0);
    setTotalAmount(0);
    await fetchEvent();
    await fetchRecommendations();
    
    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <div className="event-page">
      <section className="event-header">
        <h1 className="event-name">{currentEvent.event_name}</h1>
      </section>

      <section className="event-background">
        <img src={currentEvent.event_image} alt="Event Background" />
      </section>

      <section className="event-details">
      <p>{currentEvent.description}</p> 
        <div className="event-time-venue">
          <p><strong>Date:</strong> {currentEvent.event_date}</p>
          <p><strong>Time:</strong> {currentEvent.event_time}</p>
          <p><strong>Venue:</strong> {currentEvent.event_location}</p>
          <p><strong>Genre:</strong> {currentEvent.event_genre}</p>
          <p><strong>Total VIP Tickets Available:</strong> {currentEvent.tickets?.VIP?.available_tickets}</p>
          <p><strong>Total General Tickets Available:</strong> {currentEvent.tickets?.Regular?.available_tickets}</p>
        </div>

        <div className="ticketing">
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
      {recommendedEvents?
      <section className="similar-events">
        <h3>Similar Events</h3>
        <div className="similar-events-list">
          {recommendedEvents?.map((event) => (
            <div key={event._id} className="event-card">
              <h4>{event.event_name}</h4>
              <p><strong>Date:</strong> {event.event_date}</p>
              <p><strong>Time:</strong> {event.event_time}</p>
              <p><strong>Venue:</strong> {event.event_location}</p>
              <button onClick={() => navigate(`/event/${event._id}`)}>View</button>
            </div>
          ))}
        </div>
      </section>:<></>
      }
    </div>
  );
};

export default EventPage;
