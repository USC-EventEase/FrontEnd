import React from "react";
import { Link } from "react-router-dom";  // Import Link to handle navigation
import "./events.css";

const eventsData = [
  {
    id: 1,
    title: "Event One",
    description: "Description for Event One.",
    imageUrl: "path/to/image1.jpg",
  },
  {
    id: 2,
    title: "Event Two",
    description: "Description for Event Two.",
    imageUrl: "path/to/image2.jpg",
  },
  // Add more events as needed
];

const Events = () => {
  return (
    <div className="events-container">
      <h1>Upcoming Events</h1>
      <div className="events-grid">
        {eventsData.map((event) => (
          <div key={event.id} className="event-card">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="event-image"
            />
            <h2 className="event-title">{event.title}</h2>
            <p className="event-description">{event.description}</p>
            {/* Link to navigate to EventPage with the event ID */}
            <Link to={`/event/${event.id}`} className="book-button">Book</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
