import React from 'react';
import { useReservations } from '../context/ReservationContext';
import { Calendar as CalendarIcon, Clock, Flame, Users } from 'lucide-react';

const TIME_SLOTS = [
  { time: '17:00', label: 'Early Dinner', status: 'easy' },
  { time: '18:00', label: 'Sunset Dinner', status: 'moderate' },
  { time: '19:00', label: 'Prime Seating', status: 'peak' },
  { time: '20:00', label: 'Prime Seating', status: 'peak' },
  { time: '21:00', label: 'Late Dinner', status: 'moderate' },
  { time: '22:00', label: 'Midnight Lounge', status: 'easy' }
];

export default function Scheduler() {
  const { 
    selectedDate, 
    setSelectedDate, 
    selectedTime, 
    setSelectedTime,
    reservations,
    tables
  } = useReservations();

  // Get current date bounds (today + 30 days)
  const todayStr = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Calculate live booking capacity for each slot
  const getSlotDetails = (timeVal) => {
    const slotBookings = reservations.filter(r => r.date === selectedDate && r.time === timeVal);
    const bookedTableCount = slotBookings.reduce((sum, r) => sum + r.tableIds.length, 0);
    const totalTables = tables.length;
    
    // Percentage booked
    const percentage = Math.round((bookedTableCount / totalTables) * 100);
    
    let statusColor = 'var(--color-success)';
    let statusLabel = 'Highly Available';
    let statusClass = 'easy';

    if (percentage > 70) {
      statusColor = 'var(--color-danger)';
      statusLabel = 'Peak Capacity (Almost Full)';
      statusClass = 'peak';
    } else if (percentage > 30) {
      statusColor = 'var(--color-warning)';
      statusLabel = 'Filling Fast';
      statusClass = 'moderate';
    }

    return { percentage, statusColor, statusLabel, statusClass, bookedTableCount };
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock className="gold-text-glow" size={22} />
          <span>Date & Time Scheduler</span>
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Select your dining timeline. Slots show live booking heatmaps.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {/* Date Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CalendarIcon size={14} />
            <span>Select Date</span>
          </label>
          <input
            type="date"
            min={todayStr}
            max={maxDateStr}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-input"
            style={{
              cursor: 'pointer',
              border: '1px solid var(--border-gold-soft)',
              colorScheme: 'dark' // native datepicker dark mode support
            }}
          />
        </div>

        {/* Time slots Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Available Time Slots
          </label>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '0.75rem'
          }}>
            {TIME_SLOTS.map(slot => {
              const { percentage, statusColor, statusLabel } = getSlotDetails(slot.time);
              const isSelected = selectedTime === slot.time;
              
              return (
                <button
                  key={slot.time}
                  onClick={() => setSelectedTime(slot.time)}
                  style={{
                    background: isSelected ? 'var(--gold-gradient)' : 'rgba(26, 26, 34, 0.6)',
                    color: isSelected ? '#000' : 'var(--text-primary)',
                    border: isSelected ? '1px solid var(--gold-light)' : '1px solid var(--border-gold-soft)',
                    borderRadius: '8px',
                    padding: '0.75rem 0.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    boxShadow: isSelected ? '0 0 10px rgba(212, 175, 55, 0.3)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{slot.time}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{slot.label}</span>
                  
                  {/* Heatmap Bar */}
                  <div style={{
                    width: '80%',
                    height: '3px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '2px',
                    marginTop: '0.25rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${Math.max(percentage, 8)}%`,
                      backgroundColor: statusColor,
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Summary Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: 'rgba(18, 18, 22, 0.4)',
          border: '1px solid var(--border-gold-soft)',
          borderRadius: '8px',
          marginTop: '0.5rem'
        }}>
          <div style={{
            background: 'rgba(212, 175, 55, 0.1)',
            padding: '0.6rem',
            borderRadius: '50%',
            color: 'var(--gold-primary)'
          }}>
            <Flame size={20} className="animate-float" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Live Capacity for {selectedTime} on {new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' })}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
              <span>{getSlotDetails(selectedTime).statusLabel}</span>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <span style={{ color: 'var(--gold-primary)' }}>{getSlotDetails(selectedTime).percentage}% Booked</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
