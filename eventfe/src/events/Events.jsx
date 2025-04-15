import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  {
    id: 3,
    title: "Ted talk",
    description: "Latest tech insights.",
    imageUrl: "path/to/image3.jpg",
  },
];

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = eventsData.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div key={event.id} className="event-card">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="event-image"
              />
              <h2 className="event-title">{event.title}</h2>
              <p className="event-description">{event.description}</p>
              <Link to={`/event/${event.id}`} className="book-button">
                Book
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
