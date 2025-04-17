// EventAnalytics.jsx
import React, { useState } from 'react';
import QrScanner from './QrScanner';
import './EventAnalytics.css';
import Cookies from 'js-cookie';


const events = [
  {
    event_id:123,
    name: 'Concert Night',
    venue: 'Auditorium',
    organiser: 'John',
    time: '8 PM',
    ticketsSold: 150,
    crowdPrediction: 'High',
  },
  {
    event_id:345,
    name: 'Tech Talk',
    venue: 'Conference Hall',
    organiser: 'Sarah',
    time: '2 PM',
    ticketsSold: 75,
    crowdPrediction: 'Medium',
  },
];

const EventAnalytics = () => {
  const [activeScanner, setActiveScanner] = useState(null);
  const [validationStatus, setValidationStatus] = useState(null);
  const [scanResult, setScanResult] = useState('');

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