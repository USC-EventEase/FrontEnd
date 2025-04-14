import React, { useState } from 'react';
import './create_event.css';

const CreateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [vipTickets, setVipTickets] = useState('');
  const [generalTickets, setGeneralTickets] = useState('');
  const [vipPrice, setVipPrice] = useState('');
  const [generalPrice, setGeneralPrice] = useState('');
  const [predictedCrowd, setPredictedCrowd] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handlePredictCrowd = () => {
 // Here, you can call an API to fetch predicted crowd from the backend
    // Example using fetch API to call backend (use the actual API URL from the backend team):
    fetch('/api/predict-crowd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vipTickets,
          generalTickets,
          vipPrice,
          generalPrice,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setPredictedCrowd(data.predictedCrowd); // Assuming the backend returns 'predictedCrowd'
        })
        .catch((error) => {
          console.error('Error predicting crowd:', error);
        });
  };

  const handleCreateEvent = () => {
    // Add functionality to create an event here (send data to the server or store)
    console.log('Event Created:', {
      eventName,
      eventLocation,
      vipTickets,
      generalTickets,
      vipPrice,
      generalPrice,
    });
     // Show success popup
     setShowPopup(true);

     // Hide popup after 3 seconds
     setTimeout(() => {
       setShowPopup(false);
     }, 3000); // 3 seconds delay for the popup
  };

  return (
    <div className="create-event">
      {/* Form Section */}
      <section className="form-section">
        <h1>Create New Event</h1>
        <div className="form-container">
          {/* Left Section */}
          <div className="form-left">
            <div className="field">
              <label>Event Name:</label>
              <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
            </div>

            <div className="field">
              <label>Event Location:</label>
              <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
            </div>

            <div className="field">
              <label>Total VIP Tickets:</label>
              <input type="number" value={vipTickets} onChange={(e) => setVipTickets(e.target.value)} />
            </div>

            <div className="field">
              <label>Total General Tickets:</label>
              <input type="number" value={generalTickets} onChange={(e) => setGeneralTickets(e.target.value)} />
            </div>
          </div>

          {/* Right Section */}
          <div className="form-right">
            <div className="field">
              <label>Ticket Price (VIP):</label>
              <input type="number" value={vipPrice} onChange={(e) => setVipPrice(e.target.value)} />
            </div>

            <div className="field">
              <label>Ticket Price (General):</label>
              <input type="number" value={generalPrice} onChange={(e) => setGeneralPrice(e.target.value)} />
            </div>

            <div className="field">
              <button className="predict-button" onClick={handlePredictCrowd}>Predict Crowd</button>
            </div>

            {/* Show predicted crowd */}
            <div className="predicted-crowd">
              <label>Predicted Crowd:</label>
              <input type="text" value={predictedCrowd} disabled />
            </div>
          </div>
        </div>

        {/* Create Event button */}
        <div className="field">
          <button className="create-button" onClick={handleCreateEvent}>Create Event</button>
        </div>
      </section>
       {/* Success Popup */}
       {showPopup && (
        <div className="popup">
          <p>Event created successfully!</p>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;
