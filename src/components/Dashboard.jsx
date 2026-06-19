import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useReservations } from '../context/ReservationContext';
import { ShieldCheck, Calendar, MapPin, XCircle, CreditCard, Clock, Coffee } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { reservations, cancelBooking, tables } = useReservations();

  // Filter reservations for current logged-in user
  const userReservations = reservations.filter(
    r => r.userEmail.toLowerCase() === user?.email.toLowerCase()
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      animation: 'fade-in 0.4s ease-out'
    }}>
      {/* Welcome Card */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        backgroundImage: 'radial-gradient(ellipse at top right, rgba(212, 175, 55, 0.1) 0%, transparent 60%)',
        border: '1px solid var(--border-gold-glow)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--gold-primary)',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 600,
            marginBottom: '0.5rem'
          }}>
            <ShieldCheck size={14} />
            <span>Authenticated Private Lounge</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}>Welcome, {user?.name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage your fine dining schedules, check table allocations, and review pre-order portfolios.
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'rgba(212, 175, 55, 0.05)',
          border: '1px solid var(--border-gold-soft)',
          padding: '1rem 2rem',
          borderRadius: '12px'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>LOUNGE STATUS</span>
          <span style={{ fontSize: '1.4rem', color: 'var(--gold-primary)', fontWeight: 'bold', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
            VIP PATRON
          </span>
        </div>
      </div>

      {/* Bookings & Live Queue Panels */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        {/* Reservation List (Left) */}
        <div className="glass-panel" style={{
          flex: '2 1 500px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Your Active Bookings</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Show this folio at the reception desk upon arrival.</p>
          </div>

          {userReservations.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-muted)',
              border: '1px dashed var(--border-gold-soft)',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              No active reservations found. Visit the "Book a Table" section to reserve.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {userReservations.map(res => {
                // Calculate pre-order total
                const itemsTotal = res.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                
                return (
                  <div 
                    key={res.id}
                    style={{
                      backgroundColor: 'rgba(18, 18, 22, 0.6)',
                      border: '1px solid var(--border-gold-soft)',
                      borderRadius: '10px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}
                  >
                    {/* Header: Date & Time */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.1)',
                          color: 'var(--gold-primary)',
                          padding: '0.5rem',
                          borderRadius: '6px'
                        }}>
                          <Calendar size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>
                            {new Date(res.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Selected Slot: <span style={{ color: 'var(--gold-primary)', fontWeight: 'bold' }}>{res.time}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--color-success)',
                        border: '1px solid var(--color-success)',
                        borderRadius: '20px',
                        padding: '0.2rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        CONFIRMED
                      </div>
                    </div>

                    {/* Details: Zone & Tables */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Dining Zone</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                          <MapPin size={14} className="gold-text-glow" />
                          <span>{res.zone}</span>
                        </div>
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Assigned Tables</span>
                        <div style={{ marginTop: '0.2rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {res.tableIds.map(id => {
                            const tbl = tables.find(t => t.id === id);
                            return tbl ? `${tbl.name} (${tbl.seats} Seats)` : '';
                          }).join(', ')}
                        </div>
                      </div>

                      {itemsTotal > 0 && (
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Pre-Order Food Total</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', color: 'var(--gold-primary)', fontWeight: 'bold' }}>
                            <CreditCard size={14} />
                            <span>${(itemsTotal * 1.18).toFixed(2)} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>(inc. tax)</span></span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pre-order dishes expansion */}
                    {res.items.length > 0 && (
                      <div style={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        padding: '0.75rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.02)'
                      }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pre-Order Items Checklist:</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', marginTop: '0.4rem' }}>
                          {res.items.map((item, idx) => (
                            <span key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                              {item.qty}x {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Booking Reference: <span style={{ color: 'var(--text-secondary)' }}>{res.id.toUpperCase()}</span>
                      </span>
                      
                      <button
                        onClick={() => cancelBooking(res.id)}
                        className="btn-secondary"
                        style={{
                          borderColor: 'var(--color-danger)',
                          color: 'var(--color-danger)',
                          padding: '0.4rem 1rem',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                          e.currentTarget.style.color = '#ff6b6b';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--color-danger)';
                        }}
                      >
                        <XCircle size={14} />
                        <span>Cancel Booking</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Waitlist Queue (Right) */}
        <div className="glass-panel" style={{
          flex: '1 1 300px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          alignSelf: 'flex-start'
        }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock className="gold-text-glow animate-pulse-gold" size={20} style={{ borderRadius: '50%' }} />
              <span>Live Walk-in Waitlist</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Real-time queue tracking for walk-in tables.</p>
          </div>

          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-gold-soft)',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CURRENT ESTIMATE</span>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)' }}>
              15-20 Min
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              Queue Position: <span style={{ color: 'var(--color-warning)', fontWeight: 'bold' }}>#3 in Line</span>
            </span>

            <div style={{
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '0.5rem'
            }}>
              <div style={{
                height: '100%',
                width: '78%',
                background: 'var(--gold-gradient)',
                borderRadius: '2px'
              }}></div>
            </div>
          </div>

          {/* Queue Tips */}
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <Coffee size={16} style={{ flexShrink: 0, color: 'var(--gold-primary)' }} />
            <span>
              Pre-booked VIP tables bypass the waitlist queue entirely. Please see the host upon arrival.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
