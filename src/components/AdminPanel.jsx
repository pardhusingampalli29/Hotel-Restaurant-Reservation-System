import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHotels } from '../context/HotelContext';
import HotelForm from './HotelForm';
import { useReservations } from '../context/ReservationContext';

export default function AdminPanel() {
  const { admin, logoutAdmin } = useAuth();
  const { hotels, hotelBookings } = useHotels();
  const { reservations } = useReservations();
  const { addHotel, updateHotel, deleteHotel } = useHotels();

  const [editingHotel, setEditingHotel] = useState(null);

  const handleDelete = (id) => {
    if (confirm('Delete this hotel and its bookings?')) {
      deleteHotel(id);
    }
  };

  const openEditForm = (hotel) => {
    setEditingHotel(hotel);
    // scroll into view the form
    const el = document.getElementById('admin-hotel-form');
    el?.scrollIntoView({ behavior: 'smooth' });
  };
  // sort and organize data for admin view
  const sortedHotels = [...hotels].sort((a, b) => (a.city || '').localeCompare(b.city || '') || a.name.localeCompare(b.name));
  const sortedHotelBookings = [...hotelBookings].sort((a, b) => new Date(b.bookingDate || 0) - new Date(a.bookingDate || 0));
  const sortedReservations = [...reservations].sort((a, b) => {
    const ad = new Date(`${a.date}T${a.time}:00`);
    const bd = new Date(`${b.date}T${b.time}:00`);
    return bd - ad;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Admin Console</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Signed in as {admin?.name} — {admin?.email}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={logoutAdmin}>Sign Out</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Hotels</h3>
          <div style={{ color: 'var(--text-secondary)' }}>{hotels.length} hotels in system</div>

          {/* Add/Edit Hotel Form */}
          <div id="admin-hotel-form" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <HotelForm editing={editingHotel} onDone={() => setEditingHotel(null)} />
          </div>

          <ul style={{ marginTop: '0.75rem', maxHeight: '240px', overflow: 'auto', paddingLeft: '1rem' }}>
            {sortedHotels.map(h => (
              <li key={h.id} style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <img src={h.image ? `/src/assets/${h.image}.jpg` : h.image} alt={h.name} style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(255,255,255,0.04)' }} />
                <div style={{ flex: 1 }}>
                  <strong>{h.name}</strong><br />
                  <small style={{ color: 'var(--text-secondary)' }}>{h.city} — {h.type} — ₹{h.price.toLocaleString()}</small>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" onClick={() => openEditForm(h)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(h.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '1rem' }}>
          <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Hotel Bookings</h3>
          <div style={{ color: 'var(--text-secondary)' }}>{hotelBookings.length} total hotel bookings</div>
          <ul style={{ marginTop: '0.75rem', maxHeight: '320px', overflow: 'auto', paddingLeft: '1rem' }}>
            {sortedHotelBookings.map(b => (
              <li key={b.id} style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                <strong>{b.confirmationNumber}</strong> — <span style={{ color: 'var(--text-secondary)' }}>{b.hotelName}</span><br />
                <small style={{ color: 'var(--text-secondary)' }}>{b.userEmail} • ₹{b.totalPrice.toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1rem' }}>
        <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Restaurant Reservations</h3>
        <div style={{ color: 'var(--text-secondary)' }}>{reservations.length} reservations</div>
        <ul style={{ marginTop: '0.75rem', maxHeight: '320px', overflow: 'auto', paddingLeft: '1rem' }}>
          {sortedReservations.slice(0, 100).map(r => (
            <li key={r.id} style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              <strong>{r.id}</strong> — <span style={{ color: 'var(--text-secondary)' }}>{r.guestName || r.userEmail}</span><br />
              <small style={{ color: 'var(--text-secondary)' }}>{r.date} {r.time} • Tables: {r.tableIds?.join(', ')}</small>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-panel" style={{ padding: '1rem' }}>
        <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button className="btn-primary" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(hotels)); alert('Hotels JSON copied to clipboard'); }}>Export Hotels</button>
          <button className="btn-primary" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(hotelBookings)); alert('Hotel bookings JSON copied'); }}>Export Hotel Bookings</button>
          <button className="btn-secondary" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(reservations)); alert('Restaurant reservations copied'); }}>Export Reservations</button>
        </div>
      </div>
    </div>
  );
}
