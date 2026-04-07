import { useState } from 'react';
import { api } from '../api';

export default function ParkVehicle() {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    type: 'CAR',
    strategy: 'NEAREST'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const data = await api.postParam('/parking/park', formData);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to park vehicle');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return timeStr;
      return date.toLocaleString();
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="animate-fade-in">
      <h2>Park a Vehicle</h2>
      
      <div className="glass-card" style={{ maxWidth: '500px', marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Vehicle Number</label>
            <input 
              type="text" 
              required
              placeholder="e.g. KA-01-HH-1234"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Vehicle Type</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="CAR">Car</option>
              <option value="BIKE">Bike</option>
              <option value="TRUCK">Truck</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Parking Strategy</label>
            <select 
              value={formData.strategy}
              onChange={(e) => setFormData({...formData, strategy: e.target.value})}
            >
              <option value="NEAREST">Nearest Available Slot</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Park Vehicle'}
          </button>
        </form>
      </div>

      {error && <div className="alert error">{error}</div>}
      
      {result && (
        <div className="alert success">
          <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>Successfully Parked!</h4>
          <p>Ticket ID: <strong>{result.id}</strong></p>
          <p>Assigned Slot: <strong>{result.slot?.slotNumber || 'N/A'}</strong></p>
          <p>Vehicle: <strong>{result.vehicle?.numberPlate || 'N/A'}</strong> ({result.vehicle?.type || ''})</p>
          <p>Time: {formatTime(result.entryTime)}</p>
        </div>
      )}
    </div>
  );
}
