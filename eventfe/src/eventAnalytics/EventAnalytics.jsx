import React from "react";
import "./EventAnalytics.css";

const events = [
  {
    name: "Concert Night",
    venue: "Auditorium",
    organiser: "John",
    time: "8 PM",
    ticketsSold: 150,
    crowdPrediction: "High",
  },
  {
    name: "Tech Talk",
    venue: "Conference Hall",
    organiser: "Sarah",
    time: "2 PM",
    ticketsSold: 75,
    crowdPrediction: "Medium",
  },
];

const EventAnalytics = () => {
  return (
    <div className="event-analytics-container">
      <div className="event-analytics-title">Event Analytics</div>
      <div className="event-cards-wrapper">
        {events.map((event, idx) => (
          <div key={idx} className="event-card">
            <table>
              <tbody>
                <tr>
                  <td>Event Name</td>
                  <td>{event.name}</td>
                </tr>
                <tr>
                  <td>Venue</td>
                  <td>{event.venue}</td>
                </tr>
                <tr>
                  <td>Organiser</td>
                  <td>{event.organiser}</td>
                </tr>
                <tr>
                  <td>Time</td>
                  <td>{event.time}</td>
                </tr>
                <tr>
                  <td>No# Tickets Sold</td>
                  <td>{event.ticketsSold}</td>
                </tr>
                <tr>
                  <td>Crowd Prediction</td>
                  <td>{event.crowdPrediction}</td>
                </tr>
              </tbody>
            </table>
            <button className="delete-button">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventAnalytics;
