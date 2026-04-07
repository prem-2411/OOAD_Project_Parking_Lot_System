import { useState } from 'react';
import { api } from '../api';

export default function UnparkVehicle() {
  const [ticketId, setTicketId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticketId) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await api.postUrlOnly(`/parking/unpark/${ticketId}`);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to unpark vehicle. Please check the Ticket ID.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (t) => {
    if (!t) return '—';
    try {
      return new Date(t).toLocaleString();
    } catch {
      return t;
    }
  };

  return (
    <div className="animate-fade-in">
      <h2>Unpark a Vehicle</h2>

      <div className="glass-card" style={{ maxWidth: '420px', marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Ticket ID</label>
            <input
              type="number"
              required
              min="1"
              placeholder="Enter your ticket ID"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} style={{ background: 'var(--accent-warning)', width: '100%' }}>
            {loading ? 'Processing...' : 'Unpark and Pay'}
          </button>
        </form>
      </div>

      {error && <div className="alert error">{error}</div>}

      {result && (
        <div className="glass-card animate-fade-in" style={{ maxWidth: '500px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
              fontSize: '1.5rem'
            }}>
              ✓
            </div>
            <h3 style={{ color: '#34d399', margin: 0 }}>Vehicle Unparked Successfully</h3>
          </div>

          <div style={{
            background: 'var(--bg-primary)', borderRadius: '12px',
            padding: '1.5rem', marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Ticket ID</span>
              <span><strong>#{result.ticketId}</strong></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Vehicle</span>
              <span>{result.vehicleNumber} <span className="badge badge-blue">{result.vehicleType}</span></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Slot</span>
              <span className="badge badge-blue">{result.slotNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Entry</span>
              <span style={{ fontSize: '0.875rem' }}>{formatTime(result.entryTime)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Exit</span>
              <span style={{ fontSize: '0.875rem' }}>{formatTime(result.exitTime)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Duration</span>
              <span>{result.durationHours} hour{result.durationHours !== 1 ? 's' : ''}</span>
            </div>

            <div style={{
              borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>Total Fee</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>₹{result.fee.toFixed(2)}</span>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
            Thank you for using PARKQ. Drive safe!
          </p>
        </div>
      )}
    </div>
  );
}
