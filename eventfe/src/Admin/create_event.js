import React, { useState, useEffect } from 'react';
import './create_event.css';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';


const CreateEvent = () => {
  const API_BASE_URL = 'http://localhost:3001';
  const { id } = useParams();
  const isUpdateMode = !!id; // true if we have an id
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [vipTickets, setVipTickets] = useState('');
  const [generalTickets, setGeneralTickets] = useState('');
  const [vipPrice, setVipPrice] = useState('');
  const [generalPrice, setGeneralPrice] = useState('');
  const [predictedCrowd, setPredictedCrowd] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventGenre, setEventGenre] = useState('');
  const [eventImage, setEventImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [eventImageURL, setEventImageURL] = useState("");
  const [updateData, setUpdateData] = useState(null);

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
  useEffect(() => {
    if (isUpdateMode) {
      // Adjust the endpoint as needed; this assumes a GET endpoint to retrieve single event data
      fetch(`${API_BASE_URL}/api/admin/event/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Cookies.get("token")}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          // Update state with data coming from API:
          setEventName(data.event_name || '');
          setEventLocation(data.event_location || '');
          // If the API returns the ticket data formatted as "tickets": { "VIP": {...}, "Regular": {...} }
          setVipTickets(data.tickets?.VIP?.total_tickets || '');
          setGeneralTickets(data.tickets?.Regular?.total_tickets || '');
          setVipPrice(data.tickets?.VIP?.original_price || '');
          setGeneralPrice(data.tickets?.Regular?.original_price || '');
          setEventDescription(data.event_description || '');
          setEventDate(data.event_date || '');
          setEventTime(data.event_time || '');
          setEventGenre(data.event_genre || '');
          setEventImageURL(data.event_image || '');
          setUpdateData(data);
        })
        .catch(error => {
          console.error("Error loading event data:", error);
        });
    }
  }, [id, isUpdateMode]);


  const resetForm = () => {
    setEventName('');
    setEventLocation('');
    setVipTickets('');
    setGeneralTickets('');
    setVipPrice('');
    setGeneralPrice('');
    setPredictedCrowd('');
    setEventDescription('');
    setEventDate('');
    setEventTime('');
    setEventGenre('');
    setEventImage(null);
    setEventImageURL('');
  };

  const uploadImage = () => {
    const formData = new FormData();

    formData.append("file", eventImage);
    formData.append("upload_preset", "event_ease");
    console.log(formData);
    fetch(
      "https://api.cloudinary.com/v1_1/dz3my06vk/image/upload",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);     // This will log the actual JSON response
        setEventImageURL(data.secure_url);
      });

  };


  const handleCreateEvent = async () => {
    
    // Add functionality to create an event here (send data to the server or store)
    if(isUpdateMode){
      console.log('Event Updated:', {
        eventName,
        eventLocation,
        vipTickets,
        generalTickets,
        vipPrice,
        generalPrice,
        eventDescription,
        eventDate,
        eventTime,
        eventGenre,
        eventImage,
      });
      uploadImage();
      const response = await fetch(`${API_BASE_URL}/api/admin/event/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${Cookies.get("token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          "event_name":eventName,
          "event_description":eventDescription,
          "event_date":eventDate,
          "event_time":eventTime,
          "event_genre":eventGenre,
          "event_image":eventImageURL,
          "event_location":eventLocation,
          "tickets":{
            "VIP":{
              "total_tickets": vipTickets,
              "original_price": vipPrice,
              "current_price": updateData.tickets?.VIP?.current_price,
              "available_tickets": vipTickets > updateData.tickets?.VIP?.available_tickets ? updateData.tickets?.VIP?.available_tickets + (vipTickets - updateData.tickets?.VIP?.total_tickets) :vipTickets
            },
            "Regular":{
              "total_tickets": generalTickets,
              "original_price": generalPrice,
              "current_price": updateData.tickets?.Regular?.current_price,
              "available_tickets": generalTickets > updateData.tickets?.Regular?.available_tickets ? updateData.tickets?.Regular?.available_tickets  + (generalTickets - updateData.tickets?.Regular?.total_tickets) : generalTickets
            }
          }
        }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
    }
    else{
      console.log('Event Created:', {
        eventName,
        eventLocation,
        vipTickets,
        generalTickets,
        vipPrice,
        generalPrice,
        eventDescription,
        eventDate,
        eventTime,
        eventGenre,
        eventImage,
      });
      uploadImage();
      const response = await fetch(`${API_BASE_URL}/api/admin/event`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${Cookies.get("token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          "event_name":eventName,
          "event_description":eventDescription,
          "event_date":eventDate,
          "event_time":eventTime,
          "event_genre":eventGenre,
          "event_image":eventImageURL,
          "event_location":eventLocation,
          "tickets":{
            "VIP":{
              "total_tickets": vipTickets,
              "original_price": vipPrice,
              "current_price": vipPrice,
              "available_tickets": vipTickets
            },
            "Regular":{
              "total_tickets": generalTickets,
              "original_price": generalPrice,
              "current_price": generalPrice,
              "available_tickets": generalTickets
            }
          }
        }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
    }
     // Show success popup
     setShowPopup(true);

     // Hide popup after 3 seconds
     setTimeout(() => {
       setShowPopup(false);
       resetForm();
     }, 3000); // 3 seconds delay for the popup
  };

  return (
    <div className="create-event">
      {/* Form Section */}
      <section className="form-section">
        <h1>Add New Event</h1>
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
              <label>Event Description:</label>
              <input type="text"value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
            </div>

            <div className="field">
              <label>Total General Tickets:</label>
              <input type="number" value={generalTickets} onChange={(e) => setGeneralTickets(e.target.value)} />
            </div>
            
            <div className="field">
              <label>Total VIP Tickets:</label>
              <input type="number" value={vipTickets} onChange={(e) => setVipTickets(e.target.value)} />
            </div>

            <div className="field">
              <label>Event Image:</label>
              <input type="file" onChange={(e) => setEventImage(e.target.files[0])} />
            </div>
            
          </div>


          {/* Right Section */}
          <div className="form-right">
          <div className="field">
              <label>Event Time:</label>
              <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
            </div>

            <div className="field">
              <label>Event Genre:</label>
              <input type="text" value={eventGenre} onChange={(e) => setEventGenre(e.target.value)} />
            </div>

            <div className="field">
              <label>Event Date:</label>
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>

            <div className="field">
              <label>Ticket Price (General):</label>
              <input type="number" value={generalPrice} onChange={(e) => setGeneralPrice(e.target.value)} />
            </div>

            <div className="field">
              <label>Ticket Price (VIP):</label>
              <input type="number" value={vipPrice} onChange={(e) => setVipPrice(e.target.value)} />
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
        {isUpdateMode? <div className="field">
          <button className="create-button" onClick={handleCreateEvent}>Update Event</button>
        </div>: <div className="field">
          <button className="create-button" onClick={handleCreateEvent}>Create Event</button>
        </div>}
        

      </section>
       {/* Success Popup */}
       {showPopup && (
        isUpdateMode?<div className="popup">
        <p>Event updated successfully!</p>
      </div> :
        <div className="popup">
          <p>Event created successfully!</p>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;
