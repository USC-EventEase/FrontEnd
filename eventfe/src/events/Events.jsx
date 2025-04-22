import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./events.css";
import { all_events } from "../api/user_events";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

let eventsData = [];

const Events = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async ()=> {
      try {
        const response = await all_events();

        if(response.status === 401) {
          Cookies.remove('token');
          Cookies.remove('userId');
          Cookies.remove('type');
          navigate('/');
        }

        if (response.ok) {
          const now = new Date();
        
          eventsData = response.data
            .map((event) => {
              const [year, month, day] = event.event_date.split("-");
              const [hour, minute] = event.event_time.split(":");
              const localDateTime = new Date(
                year,
                month - 1, // 0-indexed months
                day,
                hour,
                minute
              );
        
              return {
                ...event,
                eventDateTime: localDateTime,
              };
            })
            .filter((event) => event.eventDateTime >= now) // ✅ only future/now
            .sort((a, b) => a.eventDateTime - b.eventDateTime); // ✅ earliest first
        }
        

      } catch(err) {
        console.error("Error fetching data: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = eventsData.filter((event) =>
    event.event_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function DateTimeDisplay({ date, time }) {
    const formattedDateTime = new Date(`${date}T${time}`).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  
    return (
      <div>
        <p>{formattedDateTime}</p>
      </div>
    );
  }
  
  if (loading) return <div className="text-center p-4">Loading events...</div>;

  return (
    <div className="events-container">
      <h1>All Events</h1>

      <input
        type="text"
        className="event-search-bar"
        placeholder="Search by event title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              <img
                src={event.event_image}
                alt={event.event_name}
                className="event-image"
              />
              <h2 className="event-title">{event.event_name}</h2>
              <p className="event-venue">{event.event_location}</p>
              <br></br>
              <DateTimeDisplay date={event.event_date} time={event.event_time} />
              <Link to={`/event/${event._id}`} className="book-button">
                View
              </Link>
            </div>
          ))
        ) : (
          <p>No matching events found.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
