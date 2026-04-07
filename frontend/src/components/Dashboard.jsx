import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('active'); // 'active' | 'history' | 'slots'

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statusData, activeData, slotsData] = await Promise.all([
        api.getFast('/parking/status'),
        api.getFast('/parking/tickets'),
        api.getFast('/parking/slots'),
      ]);
      setStatus(statusData);
      setTickets(activeData);
      setAllSlots(slotsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await api.getFast('/parking/history');
      setTickets(data);
      setView('history');
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchActive = async () => {
    try {
      const data = await api.getFast('/parking/tickets');
      setTickets(data);
      setView('active');
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTime = (t) => {
    if (!t || t === 'ACTIVE') return t || '—';
    try {
      return new Date(t).toLocaleString();
    } catch {
      return t;
    }
  };

  if (loading) return <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Loading dashboard...</div>;
  if (error) return <div className="alert error">{error}</div>;
  if (!status) return null;

  const occupancyPercent = status.totalSlots > 0
    ? Math.round((status.occupiedSlots / status.totalSlots) * 100)
    : 0;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Parking Lot Overview</h2>
        <button onClick={fetchAll} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          ↻ Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-label">Total Slots</span>
          <span className="stat-value">{status.totalSlots}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label" style={{ color: '#6ee7b7' }}>Available</span>
          <span className="stat-value" style={{ color: '#10b981' }}>{status.availableSlots}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label" style={{ color: '#fca5a5' }}>Occupied</span>
          <span className="stat-value" style={{ color: '#ef4444' }}>{status.occupiedSlots}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label" style={{ color: '#fde68a' }}>Occupancy</span>
          <span className="stat-value" style={{ color: '#f59e0b' }}>{occupancyPercent}%</span>
        </div>
      </div>

      {/* Occupancy Bar */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ margin: 0, marginBottom: '1rem' }}>Capacity</h3>
        <div style={{
          width: '100%', height: '14px', background: 'var(--bg-primary)',
          borderRadius: '7px', overflow: 'hidden'
        }}>
          <div style={{
            width: `${occupancyPercent}%`, height: '100%',
            background: occupancyPercent > 80 ? 'linear-gradient(90deg, #ef4444, #dc2626)' :
              occupancyPercent > 50 ? 'linear-gradient(90deg, #f59e0b, #d97706)' :
                'linear-gradient(90deg, #10b981, #059669)',
            borderRadius: '7px', transition: 'width 0.6s ease'
          }} />
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '0.875rem' }}>
          {status.occupiedSlots} of {status.totalSlots} slots currently in use
        </p>
      </div>

      {/* Slot Grid */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ margin: 0, marginBottom: '1rem' }}>Slot Map</h3>
        {allSlots.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No slots configured yet. Go to Slot Administration to add some.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {allSlots.map((slot) => (
              <div
                key={slot.slotNumber}
                style={{
                  width: '80px', height: '64px',
                  borderRadius: '10px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 600,
                  border: '1px solid var(--border)',
                  background: slot.occupied
                    ? 'rgba(239, 68, 68, 0.15)'
                    : 'rgba(16, 185, 129, 0.1)',
                  color: slot.occupied ? '#f87171' : '#6ee7b7',
                  transition: 'transform 0.2s',
                  cursor: 'default'
                }}
              >
                <span style={{ fontSize: '1rem' }}>{slot.slotNumber}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{slot.type}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span><span style={{ color: '#6ee7b7' }}>●</span> Available</span>
          <span><span style={{ color: '#f87171' }}>●</span> Occupied</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={fetchActive}
            style={{
              padding: '0.5rem 1rem', fontSize: '0.875rem',
              background: view === 'active' ? 'var(--accent)' : 'transparent',
              border: view === 'active' ? 'none' : '1px solid var(--border)',
              color: view === 'active' ? 'white' : 'var(--text-secondary)'
            }}
          >
            Active Vehicles
          </button>
          <button
            onClick={fetchHistory}
            style={{
              padding: '0.5rem 1rem', fontSize: '0.875rem',
              background: view === 'history' ? 'var(--accent)' : 'transparent',
              border: view === 'history' ? 'none' : '1px solid var(--border)',
              color: view === 'history' ? 'white' : 'var(--text-secondary)'
            }}
          >
            History
          </button>
        </div>

        {tickets.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>
            {view === 'active' ? 'No vehicles currently parked.' : 'No ticket history yet.'}
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Vehicle</th>
                  <th>Slot</th>
                  <th>Entry Time</th>
                  <th>Exit Time</th>
                  <th>Fee</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.ticketId}>
                    <td><strong>#{t.ticketId}</strong></td>
                    <td>{t.vehicleNumber}</td>
                    <td><span className="badge badge-blue">{t.slotNumber}</span></td>
                    <td style={{ fontSize: '0.85rem' }}>{formatTime(t.entryTime)}</td>
                    <td style={{ fontSize: '0.85rem' }}>{formatTime(t.exitTime)}</td>
                    <td>{t.fee > 0 ? `₹${t.fee.toFixed(2)}` : '—'}</td>
                    <td>
                      <span className={`badge ${t.exitTime === 'ACTIVE' ? 'badge-green' : 'badge-red'}`}>
                        {t.exitTime === 'ACTIVE' ? 'ACTIVE' : 'EXITED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
