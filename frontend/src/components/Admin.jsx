import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Admin() {
  const [formData, setFormData] = useState({ slotNumber: '', type: 'CAR' });
  const [slots, setSlots] = useState([]);
  const [stats, setStats] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slotsData, statsData] = await Promise.all([
        api.getFast('/admin/slots'),
        api.getFast('/admin/stats'),
      ]);
      setSlots(slotsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      await api.postParam('/admin/add-slot', formData);
      setResult(`Slot "${formData.slotNumber}" for ${formData.type} added successfully!`);
      setFormData({ slotNumber: '', type: 'CAR' });
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to add slot');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (slotNumber) => {
    if (!confirm(`Delete slot "${slotNumber}"? This cannot be undone.`)) return;
    setError(null);
    try {
      await api.delete(`/admin/delete-slot/${slotNumber}`);
      setResult(`Slot "${slotNumber}" deleted.`);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2>System Administration</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Manage parking slots and view system statistics.
      </p>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <span className="stat-label">Car Slots</span>
            <span className="stat-value" style={{ color: '#60a5fa' }}>{stats.carSlots}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Bike Slots</span>
            <span className="stat-value" style={{ color: '#a78bfa' }}>{stats.bikeSlots}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Truck Slots</span>
            <span className="stat-value" style={{ color: '#fb923c' }}>{stats.truckSlots}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Add Slot Form */}
        <div className="glass-card">
          <h3>Add New Slot</h3>
          <form onSubmit={handleAddSlot} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Slot Identifier</label>
              <input
                type="text"
                required
                placeholder="e.g. A1, B2, VIP-1"
                value={formData.slotNumber}
                onChange={(e) => setFormData({ ...formData, slotNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="CAR">Car</option>
                <option value="BIKE">Bike</option>
                <option value="TRUCK">Truck</option>
              </select>
            </div>
            <button type="submit" disabled={loading} style={{ background: 'var(--accent-success)', width: '100%' }}>
              {loading ? 'Adding...' : '+ Add Slot'}
            </button>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="glass-card">
          <h3>Quick Batch Add</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Quickly add multiple slots with auto-generated IDs.
          </p>
          <BatchAddForm onAdded={fetchData} setError={setError} setResult={setResult} />
        </div>
      </div>

      {error && <div className="alert error" style={{ marginTop: '1.5rem' }}>{error}</div>}
      {result && <div className="alert success" style={{ marginTop: '1.5rem' }}>{result}</div>}

      {/* Slot Table */}
      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>All Parking Slots ({slots.length})</h3>
          <button onClick={fetchData} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Refresh</button>
        </div>
        {slots.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No slots configured yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Slot Number</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.slotNumber}>
                    <td><strong>{slot.slotNumber}</strong></td>
                    <td>
                      <span className={`badge ${
                        slot.type === 'CAR' ? 'badge-blue' :
                        slot.type === 'BIKE' ? 'badge-green' : 'badge-red'
                      }`}>{slot.type}</span>
                    </td>
                    <td>
                      <span className={`badge ${slot.occupied ? 'badge-red' : 'badge-green'}`}>
                        {slot.occupied ? 'OCCUPIED' : 'AVAILABLE'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteSlot(slot.slotNumber)}
                        disabled={slot.occupied}
                        style={{
                          background: slot.occupied ? '#374151' : 'var(--accent-danger)',
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.75rem',
                          cursor: slot.occupied ? 'not-allowed' : 'pointer',
                          opacity: slot.occupied ? 0.4 : 1
                        }}
                      >
                        Delete
                      </button>
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

function BatchAddForm({ onAdded, setError, setResult }) {
  const [prefix, setPrefix] = useState('');
  const [count, setCount] = useState(5);
  const [type, setType] = useState('CAR');
  const [loading, setLoading] = useState(false);

  const handleBatch = async (e) => {
    e.preventDefault();
    if (!prefix) return;
    setLoading(true);
    setError(null);

    try {
      for (let i = 1; i <= count; i++) {
        await api.postParam('/admin/add-slot', {
          slotNumber: `${prefix}${i}`,
          type
        });
      }
      setResult(`Added ${count} slots: ${prefix}1 to ${prefix}${count}`);
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleBatch}>
      <div className="form-group">
        <label className="form-label">Prefix (e.g. "A", "B", "VIP-")</label>
        <input type="text" required placeholder="A" value={prefix}
          onChange={(e) => setPrefix(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Count</label>
        <input type="number" required min="1" max="50" value={count}
          onChange={(e) => setCount(parseInt(e.target.value) || 1)} />
      </div>
      <div className="form-group">
        <label className="form-label">Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="CAR">Car</option>
          <option value="BIKE">Bike</option>
          <option value="TRUCK">Truck</option>
        </select>
      </div>
      <button type="submit" disabled={loading} style={{ background: 'var(--accent)', width: '100%' }}>
        {loading ? 'Adding...' : `Add ${count} Slots`}
      </button>
    </form>
  );
}
