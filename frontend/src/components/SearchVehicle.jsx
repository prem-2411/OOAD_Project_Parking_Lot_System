import { useState } from 'react';
import { api } from '../api';

export default function SearchVehicle() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!vehicleNumber) return;
    
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const data = await api.getFast(`/parking/search?vehicleNumber=${encodeURIComponent(vehicleNumber)}`);
      setResult(data);
    } catch (err) {
      setError('Vehicle not found or an error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2>Locate Vehicle</h2>
      
      <div className="glass-card" style={{ maxWidth: '500px', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">Vehicle Number</label>
            <input 
              type="text" 
              required
              placeholder="e.g. KA-01-HH-1234"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <div className="alert error">{error}</div>}
      
      {result && (
        <div className="glass-card animate-fade-in">
          <h3>Vehicle Found</h3>
          <div className="grid grid-cols-2" style={{ marginTop: '1rem' }}>
            <div>
              <p className="form-label">Parking Slot</p>
              <span className="badge badge-blue" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                {result.slotNumber}
              </span>
            </div>
            <div>
              <p className="form-label">Ticket Info</p>
              <p>ID: <strong>{result.ticketId}</strong></p>
              <p>Vehicle: <strong>{result.vehicleNumber}</strong></p>
            </div>
            <div>
              <p className="form-label">Entry Time</p>
              <p>{result.entryTime ? new Date(result.entryTime).toLocaleString() : 'N/A'}</p>
            </div>
            <div>
              <p className="form-label">Status</p>
              <span className={`badge ${result.exitTime === 'ACTIVE' || !result.exitTime ? 'badge-green' : 'badge-red'}`} 
                    style={{ fontSize: '0.875rem', padding: '0.35rem 0.75rem' }}>
                {result.exitTime === 'ACTIVE' || !result.exitTime ? 'ACTIVE' : 'Exited'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
