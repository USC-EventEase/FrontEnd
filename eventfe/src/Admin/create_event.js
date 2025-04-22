import React, { useState, useEffect } from 'react';
import './create_event.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { get_event, update_event, create_event, crowd_prediction } from '../api/admin_events';
import { verifyAdmin } from '../api/auth';


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
  const [predictedCrowd, setPredictedCrowd] = useState(0);
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventGenre, setEventGenre] = useState('');
  const [eventImage, setEventImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [eventImageURL, setEventImageURL] = useState("");
  const [updateData, setUpdateData] = useState(null);

  function logout (){
    navigate('/');
  }
  const checkAdmin = async () => {
    try {
      const response = await verifyAdmin();
      if (!response.ok) {
        logout();
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      logout();
    }
  };

  const handlePredictCrowd = async() => {
    const totalTickets = Number(vipTickets) + Number(generalTickets);
    const averagePrice = totalTickets > 0
      ? (Number(vipPrice) * Number(vipTickets) + Number(generalPrice) * Number(generalTickets)) / totalTickets
      : 0;

    console.log(eventGenre, eventDate, totalTickets, averagePrice, eventLocation);
    const response = await crowd_prediction(eventGenre, eventDate, totalTickets, averagePrice, eventLocation);
    if(response.ok){
      setPredictedCrowd(response.data.eventId)
    }
  };

  useEffect(() => {
    checkAdmin();
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
  const getLocalDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    if (!eventName || !eventLocation || !eventDescription || !eventDate || !eventTime || !eventGenre || !vipTickets || !vipPrice || !generalTickets || !generalPrice || (!eventImage && !isUpdateMode)) {
      alert("Please fill in all required fields.");
      return;
    }
    
    let uploadedUrl;
    if(isUpdateMode && !eventImage){
      uploadedUrl = eventImageURL;
    }
    else{
      uploadedUrl = await uploadImage();
    }
    if (!uploadedUrl) {
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
      navigate('/admin/analytics');
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
            {isUpdateMode? <label>Event Image(Skip if not changed): </label>:<label>Event Image: </label>}
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
              <label>Event Time (Local Time):</label>
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
                min={getLocalDateString()}
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
