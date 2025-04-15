import React, { useState } from "react";
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
  const [activeScanner, setActiveScanner] = useState(null);
  const [validationStatus, setValidationStatus] = useState(null);

  const handleValidateClick = (index) => {
    // Toggle scanner visibility
    if (activeScanner === index) {
      setActiveScanner(null);
      setValidationStatus(null);
    } else {
      setActiveScanner(index);
      setValidationStatus(null); // Reset previous result
    }
  };

  const fakeValidateTicket = (eventName) => {
    // Fake logic for now
    if (eventName.toLowerCase().includes("concert")) {
      setValidationStatus("valid");
    } else {
      setValidationStatus("invalid");
    }
  };

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

            <button
              className="validate-button"
              onClick={() => handleValidateClick(idx)}
            >
              Validate QR
            </button>

            {activeScanner === idx && (
              <div className="qr-scan-placeholder">
                <div className="camera-box"> Camera would open here...</div>
                <button
                  className="validate-button"
                  onClick={() => fakeValidateTicket(event.name)}
                >
                  **SCAN**
                </button>

                {validationStatus === "valid" && (
                  <div className="validated-message success">
                    Ticket Validated
                  </div>
                )}
                {validationStatus === "invalid" && (
                  <div className="validated-message error">
                    Ticket Not Validated
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventAnalytics;
