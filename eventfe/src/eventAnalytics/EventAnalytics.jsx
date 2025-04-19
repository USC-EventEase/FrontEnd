// EventAnalytics.jsx
import React, { useEffect, useState } from 'react';
import QrScanner from './QrScanner';
import './EventAnalytics.css';
import Cookies from 'js-cookie';
import { get_all_events, get_chart_data } from '../api/admin_events';
import { PieChart, Pie, Tooltip, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

// let events = [];

const EventAnalytics = () => {
  const [activeScanner, setActiveScanner] = useState(null);
  const [validationStatus, setValidationStatus] = useState(null);
  const [scanResult, setScanResult] = useState('');
  const [events, setEvents] = useState([]);

  const [pieChartData, setPieChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);

  const [activeIndex, setActiveIndex] = useState(-1);
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',  
    '#FF6347', '#90EE90', '#6495ED', '#FFD700', 
    '#FF4500', '#32CD32', '#8A2BE2', '#FF1493', 
    '#00BFFF', '#20B2AA', '#FFD700', '#FF69B4'  
  ];

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };


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

    const fetchDataCharts = async () => {
      try {
        const response = await get_chart_data();

        if(response.ok) {
          const data = response.data;
          setPieChartData(data["pieChart"]);
          setLineChartData(data["lineChart"]);
        }
      } catch(err) {
        console.error(err);
      }
    }

    fetchData();
    fetchDataCharts();

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
      <div className="charts">
        <div className="pie-chart-container">
          <PieChart width={700} height={700}>
            <Pie activeIndex={activeIndex} data={pieChartData} dataKey="totalTicketsSold" outerRadius={250} fill="green" onMouseEnter={onPieEnter} style={{ cursor: 'pointer', outline: 'none' }} >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index%COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              content={({ payload }) => {
                if (payload && payload.length > 0) {
                  const { eventName, totalTicketsSold } = payload[0].payload;
                  return (
                    <div className="custom-tooltip">
                      <h3>{eventName}</h3>
                      <p>Tickets Sold: {totalTicketsSold}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </div>

        <div className="line-chart-container" >
          <ResponsiveContainer width="100%" aspect={3}>
              <LineChart data={lineChartData} >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" interval={"preserveStartEnd"}/>
                <YAxis />
                <Tooltip />
                <Legend layout="vertical" 
                  verticalAlign="middle" 
                  align="right" 
                  wrapperStyle={{ top: 150, left: -120 }}/>
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
          </ResponsiveContainer>
        </div>
        <br></br><br></br>
      </div>
    </div>
  );
};

export default EventAnalytics;