// src/eventAnalytics/EventAnalytics.jsx
import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import QrScanner from './QrScanner';
import './EventAnalytics.css';
import Cookies from 'js-cookie';
import {
  get_all_events,
  get_chart_data,
  delete_event,
} from '../api/admin_events';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Label,
  Tooltip
} from 'recharts';
import { verifyAdmin } from '../api/auth';


// colour palette for charts
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#FF6347',
  '#90EE90',
  '#6495ED',
  '#FFD700',
  '#FF4500',
  '#32CD32',
  '#8A2BE2',
  '#FF1493',
  '#00BFFF',
  '#20B2AA',
];

// ---------- helpers ---------- //
const RADIAN = Math.PI / 180;
const renderSliceLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  payload,
  index,
}) => {
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill={COLORS[index % COLORS.length]}
      fontSize={12}
      fontWeight="bold"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${payload.eventName} (${payload.totalTicketsSold} Tickets, ${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};


export default function EventAnalytics() {
  const [events, setEvents] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [activeScanner, setActiveScanner] = useState(null);
  const [scanResult, setScanResult] = useState('');
  const [validationStatus, setValidationStatus] = useState(null);
  const navigate = useNavigate();

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
  const handleDelete = async (eventId) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;
  
    try {
      const response = await delete_event(eventId);
      if (response.ok) {
        // Remove event from local state
        setEvents((prev) => prev.filter((e) => e.event_id !== eventId));
  
        // Optionally refresh chart data
        const updatedChartData = await get_chart_data();
        if (updatedChartData.ok) {
          const filteredPie = updatedChartData.data.pieChart.filter(
            (entry) => entry.totalTicketsSold > 0
          );
          setPieChartData(filteredPie);
          setLineChartData(updatedChartData.data.lineChart);
        }
      } else {
        alert("Failed to delete the event. Please try again.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong.");
    }
  };
  
  useEffect(() => {
    checkAdmin();
    const get_data_all = (async () => {
      try {
        const resEvents = await get_all_events();
        if (resEvents.ok) {
          const now = new Date();

          const mapped = resEvents.data.map((i) => {
            const eventDateTime = new Date(`${i.event_date}T${i.event_time}`);

            return {
              event_id: String(i._id),
              name: i.event_name,
              venue: i.event_location,
              date: formatDateVerbose(i.event_date),
              time: i.event_time,
              eventDateTime, // ⏱️ combine date + time
              ticketsSold:
                i.tickets.VIP.total_tickets +
                i.tickets.Regular.total_tickets -
                i.tickets.VIP.available_tickets -
                i.tickets.Regular.available_tickets,
            };
          });
          console.log(mapped)
          // ✅ Sort: upcoming/current first, past last
          const sorted = mapped.sort((a, b) => {
            const aIsPast = a.eventDateTime < now;
            const bIsPast = b.eventDateTime < now;

            if (aIsPast && !bIsPast) return 1;
            if (!aIsPast && bIsPast) return -1;

            return a.eventDateTime - b.eventDateTime;
          });

          setEvents(sorted);
        }

        const resCharts = await get_chart_data();
        if (resCharts.ok) {
          const filteredPie = resCharts.data.pieChart.filter(
            (entry) => entry.totalTicketsSold > 0
          );
          setPieChartData(filteredPie);
          setLineChartData(resCharts.data.lineChart);
        }
      } catch (e) {
        console.error(e);
      }
    })
    get_data_all();
  }, []);

  const verifyTicket = async () => {
    try {
      const res = await fetch(scanResult, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setValidationStatus(res.status === 200 ? 'valid' : 'invalid');
      if (res.status === 200) setTimeout(() => setActiveScanner(null), 2000);
    } catch {
      setValidationStatus('invalid');
    }
  };
  const update_event = async(event_id)=>{
    navigate(`/update_event/${event_id}`)
  }


  function formatDateVerbose(dateStr) {
    const [year, month, day] = dateStr.split('-'); // "2025-04-20"
    const date = new Date(+year, +month - 1, +day); // Local time date
  
    const suffix =
      day % 10 === 1 && day !== '11'
        ? 'st'
        : day % 10 === 2 && day !== '12'
        ? 'nd'
        : day % 10 === 3 && day !== '13'
        ? 'rd'
        : 'th';
  
    const monthName = date.toLocaleString('default', { month: 'long' });
    const yearNumber = date.getFullYear();
  
    return `${parseInt(day)}${suffix} ${monthName} ${yearNumber}`;
  }
  
  
  return (
    <div className="ea-container">
      
      <h1 className="ea-title">Event Analytics</h1>
      <div className="charts">
        <section className="chart-section">
          <h2 className="chart-header">Ticket Sales by Event</h2>

          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="totalTicketsSold"
                nameKey="eventName"
                innerRadius={90}
                outerRadius={160}
                paddingAngle={2}
                cornerRadius={5}
                labelLine={false}
                label={renderSliceLabel}
              >
                {pieChartData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={COLORS[idx % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </section>

        <section className="chart-section">
          <h2 className="chart-header">Revenue Over Time</h2>

          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={lineChartData} margin={{ top: 20, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })
              }
            />

              <YAxis tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}>
                <Label
                  value="Revenue ($)"
                  angle={-90}
                  position="insideLeft"
                  offset={10}
                  style={{ textAnchor: 'middle' }}
                />
              </YAxis>
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`]}
                contentStyle={{
                  borderRadius: '6px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                  padding: '8px 12px',
                  width:'fit-content'
                }}
                cursor={{ stroke: '#8884d8', strokeWidth: 1 }}
              />

              <Legend verticalAlign="bottom" height={36} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
                name="Total revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </div>

      <h1 className="ea-title">Your Events</h1>
      <div className="ea-cards">
      
        {events.map((e) => (
          <div key={e.event_id} className="ea-card">
            <table className="ea-table">
              <tbody>
                {[
                  ['Name', e.name],
                  ['Venue', e.venue],
                  ['Date', e.date],
                  ['Time (Local Time)', e.time],
                  ['Tickets Sold', e.ticketsSold],
                ].map(([l, v]) => (
                  <tr key={l}>
                    <td className="ea-label">{l}</td>
                    <td className="ea-value">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ea-buttons">
            <button
                className="ea-btn update"
                onClick={() => update_event(e.event_id)}
              >
                Update
              </button>
              <button
                className="ea-btn delete"
                onClick={() => handleDelete(e.event_id)}
              >
                Delete
              </button>
              <button
                className="ea-btn validate"
                onClick={() =>
                  setActiveScanner((s) => (s === e.event_id ? null : e.event_id))
                }
              >
                {activeScanner === e.event_id ? 'Close Scanner' : 'Validate QR'}
              </button>
            </div>

            {activeScanner === e.event_id && (
              <div className="ea-scanner-area">
                <QrScanner onResult={(r) => setScanResult(r)} />
                {scanResult && <p>✅ Scan Successful</p>}
                {scanResult && (
                  <button className="ea-btn validate" onClick={verifyTicket}>
                    Verify Ticket
                  </button>
                )}
                {validationStatus && (
                  <p
                    className={
                      validationStatus === 'valid' ? 'ea-valid' : 'ea-invalid'
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
}