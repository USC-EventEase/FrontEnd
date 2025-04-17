import React, { useState, useEffect } from 'react';
import './create_event.css';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { get_event, update_event, create_event } from '../api/admin_events';


const CreateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    // Example API call to fetch predicted crowd from the backend:
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
      const fetchData = async () => {
        try {
          const response = await get_event(id);
          if(response.ok) {
            const data = response.data;
  
            setEventName(data.event_name || '');
            setEventLocation(data.event_location || '');
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
          }
        } catch(err) {
          console.error("Error loading event data: ", err);
        }
      };
      
      fetchData();
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

  // Updated uploadImage function that returns the secure URL after uploading the image.
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", eventImage);
    formData.append("upload_preset", "event_ease");
    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dz3my06vk/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      // Optionally update state, if needed
      setEventImageURL(data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };

  // Handle event creation or update after the image upload has completed.
  const handleCreateEvent = async () => {
    // Wait for the image upload to complete and get the image URL.
    // console.log(eventImage)
    const uploadedUrl = await uploadImage();
    if (!uploadedUrl) {
      // console.log(uploadedUrl);
      console.error("Image upload failed.");
      return;
    }

    if (isUpdateMode) {
      try {
        const response = await update_event(id, eventName, eventDescription, eventDate, eventTime, eventGenre, uploadedUrl, eventLocation, vipTickets, vipPrice, updateData.tickets?.VIP?.current_price, updateData.tickets?.VIP?.available_tickets, updateData.tickets?.VIP?.total_tickets, generalTickets, generalPrice, updateData.tickets?.Regular?.current_price, updateData.tickets?.Regular?.available_tickets, updateData.tickets?.Regular?.total_tickets);
        if(response.status === 401) {
          navigate('/');
        }
        const data = response.data;
      } catch (err) {
        console.error(err);
      }
    } 
    
    else {
      try {
        const response = await create_event(eventName, eventDescription, eventDate, eventTime, eventGenre, uploadedUrl, eventLocation, vipTickets, vipPrice, generalTickets, generalPrice);
        if(response.status === 401) {
          navigate('/');
        }
        const data = response.data;
      } catch (err) {
        console.error(err);
      }
    }

    // Display popup message and reset form after 3 seconds.
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      resetForm();
    }, 3000);
  };

  return (
    <div className="create-event">
      <section className="form-section">
        <h1>{isUpdateMode ? 'Update Event' : 'Add New Event'}</h1>
        <div className="form-container">
          <div className="form-left">
            <div className="field">
              <label>Event Name:</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Event Location:</label>
              <input
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Event Description:</label>
              <input
                type="text"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Total General Tickets:</label>
              <input
                type="number"
                value={generalTickets}
                onChange={(e) => setGeneralTickets(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Total VIP Tickets:</label>
              <input
                type="number"
                value={vipTickets}
                onChange={(e) => setVipTickets(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Event Image:</label>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    // console.log("Selected file:", e.target.files[0]); // Debug log
                    setEventImage(e.target.files[0]);
                  } else {
                    // console.log("No file selected");
                    setEventImage(null);
                  }
                }}
              />
            </div>
          </div>
          <div className="form-right">
            <div className="field">
              <label>Event Time:</label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Event Genre:</label>
              <input
                type="text"
                value={eventGenre}
                onChange={(e) => setEventGenre(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Event Date:</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Ticket Price (General):</label>
              <input
                type="number"
                value={generalPrice}
                onChange={(e) => setGeneralPrice(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Ticket Price (VIP):</label>
              <input
                type="number"
                value={vipPrice}
                onChange={(e) => setVipPrice(e.target.value)}
              />
            </div>
            <div className="field">
              <button className="predict-button" onClick={handlePredictCrowd}>
                Predict Crowd
              </button>
            </div>
            <div className="predicted-crowd">
              <label>Predicted Crowd:</label>
              <input type="text" value={predictedCrowd} disabled />
            </div>
          </div>
        </div>
        <div className="field">
          <button className="create-button" onClick={handleCreateEvent}>
            {isUpdateMode ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </section>
      {showPopup && (
        isUpdateMode ? (
          <div className="popup">
            <p>Event updated successfully!</p>
          </div>
        ) : (
          <div className="popup">
            <p>Event created successfully!</p>
          </div>
        )
      )}
    </div>
  );
};

export default CreateEvent;
