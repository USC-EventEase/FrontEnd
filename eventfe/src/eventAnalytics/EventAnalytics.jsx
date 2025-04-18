// EventAnalytics.jsx
import React, { useEffect, useState } from 'react';
import QrScanner from './QrScanner';
import './EventAnalytics.css';
import Cookies from 'js-cookie';
import { get_all_events } from '../api/admin_events';


let events = [];

const EventAnalytics = () => {
  const [activeScanner, setActiveScanner] = useState(null);
  const [validationStatus, setValidationStatus] = useState(null);
  const [scanResult, setScanResult] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get_all_events();

        if(response.ok) {
          const data = response.data;

          if(data.length > 0) {
            const new_events = data.map((item) => {
              return {
                event_id: item._id,
                name: item.event_name,
                venue: item.event_location,
                time: item.event_time,
                ticketsSold: item.tickets.VIP.total_tickets + item.tickets.Regular.total_tickets - item.tickets.VIP.available_tickets - item.tickets.Regular.available_tickets
              };
            });

            setEvents(new_events);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleValidateClick = idx => {
    setActiveScanner(activeScanner === idx ? null : idx);
    setValidationStatus(null);
    setScanResult('');
  };

  const handleScanResult = async (result) => {
    setScanResult(result);
  };

  const verifyTicket = async (idx)=>{
    // const parts = scanResult.split('/');
    // const event_id = parts[parts.length - 3];
    // if(idx!=event_id){
    //   console.log(event_id)
    //   setValidationStatus('invalid');
    // }
    // else{
      try {
        const response = await fetch(scanResult, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${Cookies.get("token")}`,
            'Content-Type': 'application/json',
        }
        });
        console.log(response)
        if (response.status === 200) {
          setValidationStatus('valid');
          setTimeout(() => {
            setActiveScanner(null);
          }, 2000);
        } else {
          setValidationStatus('invalid');
        }
      } catch (error) {
        console.error("Validation failed:", error);
        
        setValidationStatus('invalid');
      }
    // }
  }
  

  return (
    <div className="ea-container">
      <h1 className="ea-title">Event Analytics</h1>
      <div className="ea-cards">
        {events.map((e, idx) => (
          <div key={e.event_id} className="ea-card">
            <table className="ea-table">
              <tbody>
                {Object.entries(e).map(([k, v]) => (
                  <tr key={k}>
                    <td className="ea-label">{k.replace(/([A-Z])/g, ' $1')}</td>
                    <td className="ea-value">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ea-buttons">
              <button className="ea-btn delete">Delete</button>
              <button
                className="ea-btn validate"
                onClick={() => handleValidateClick(e.event_id)}
              >
                {activeScanner === e.event_id ? 'Close Scanner' : 'Validate QR'}
              </button>
            </div>

            {activeScanner === e.event_id && (
              <div className="ea-scanner-area">
                <QrScanner onResult={handleScanResult} />
                {scanResult && (
                
                <p> ✅ Scan Successfull</p>
                )}
                {scanResult && (
                
                  <button
                  className="ea-btn validate"
                  onClick={() => verifyTicket(e.event_id)}
                >Verify Ticket</button>
                )}

                
                

                {validationStatus && (
                  <p
                    className={
                      validationStatus === 'valid'
                        ? 'ea-valid'
                        : 'ea-invalid'
                    }
                  >
                    {validationStatus === 'valid'
                      ? '✅ Ticket Validated'
                      : '❌ Ticket Invalid'}
                  </p>
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