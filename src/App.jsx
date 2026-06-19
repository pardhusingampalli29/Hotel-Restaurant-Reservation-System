import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReservationProvider, useReservations } from './context/ReservationContext';
import { HotelProvider, useHotels } from './context/HotelContext';
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import Scheduler from './components/Scheduler';
import TableLayoutMap from './components/TableLayoutMap';
import FoodMenu from './components/FoodMenu';
import Dashboard from './components/Dashboard';
import HotelSearch from './components/HotelSearch';
import HotelBookings from './components/HotelBookings';
import HotelsMap from './components/HotelsMap';
import AdminPanel from './components/AdminPanel';

import { Sparkles, Calendar, BookOpen, Clock, Heart, Users, MapPin, CheckCircle, ArrowRight, ShieldAlert, Hotel, Map, Luggage } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [authOpen, setAuthOpen] = useState(false);
  const { user, admin } = useAuth();
  const { 
    selectedTables, 
    selectedDate, 
    selectedTime, 
    selectedZone, 
    preOrderCart, 
    createBooking,
    tables
  } = useReservations();

  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');

  // Calculate pre-order sum
  const foodTotal = preOrderCart.reduce((sum, c) => sum + (c.item.price * c.qty), 0);
  const estimatedTotal = foodTotal > 0 ? foodTotal * 1.18 : 0; // with tax & service charge

  const handleFinalBooking = () => {
    setBookingError('');
    if (!user) {
      setAuthOpen(true);
      return;
    }

    const res = createBooking(user.email, user.name);
    if (res.success) {
      setBookingSuccess(res.booking);
      setActiveTab('dashboard');
      // Clear notification after 5 seconds
      setTimeout(() => setBookingSuccess(null), 6000);
    } else {
      setBookingError(res.error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAuth={() => setAuthOpen(true)} 
      />

      {/* Main Container */}
      <main style={{ flex: 1, padding: '1rem 2rem 3rem 2rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        
        {/* Booking success notification banner */}
        {bookingSuccess && (
          <div className="glass-panel animate-slide-in" style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--color-success)',
            borderRadius: '12px',
            padding: '1.25rem 2rem',
            color: 'var(--text-primary)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <CheckCircle size={24} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#a7f3d0' }}>Reservation Confirmed!</h4>
              <p style={{ fontSize: '0.85rem', color: '#d1fae5', marginTop: '0.15rem' }}>
                Your booking ref is <span style={{ fontWeight: 'bold' }}>{bookingSuccess.id.toUpperCase()}</span>. An invitation voucher has been placed in your Lounges panel.
              </p>
            </div>
          </div>
        )}

        {/* 1. HOME TAB */}
        {activeTab === 'home' ? (admin ? (
          <AdminPanel />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', animation: 'fade-in 0.4s ease-out' }}>
            
            {/* Hero Section */}
            <div className="glass-panel" style={{
              padding: '4rem 3rem',
              borderRadius: '16px',
              border: '1px solid var(--border-gold-glow)',
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.85)), url("/src/assets/luxury_dining.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '1.5rem',
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)',
              minHeight: '420px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--gold-primary)'
              }}>
                <Sparkles size={16} />
                <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: 600, textTransform: 'uppercase' }}>
                  Michelin Three Stars
                </span>
              </div>

              <h1 style={{
                fontSize: '3.6rem',
                lineHeight: '1.2',
                fontFamily: 'var(--font-serif)',
                background: 'var(--gold-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                maxWidth: '650px'
              }}>
                Crafting Culinary Legacies Since 1894
              </h1>

              <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                maxWidth: '550px'
              }}>
                Indulge in a premium gastronomic experience. Select private booths, choose signature caviar pre-orders, and monitor reservation availability in real-time.
              </p>

              {/* Admin login is available via the Log In / Sign Up modal only */}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => {
                    if (user) {
                      setActiveTab('book');
                    } else {
                      setAuthOpen(true);
                    }
                  }}
                  className="btn-primary"
                >
                  <span>Begin Reservation</span>
                  <ArrowRight size={16} />
                </button>
                
                <button 
                  onClick={() => {
                    const el = document.getElementById('discover-sections');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-secondary"
                >
                  <span>Explore Rooms</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}>
              <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold-primary)', padding: '0.75rem', borderRadius: '50%' }}>
                  <Calendar size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>100% Persisted</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Modify & cancel anytime via local storage.</p>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold-primary)', padding: '0.75rem', borderRadius: '50%' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Live Waitlist Counter</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Simulated smart queue estimations.</p>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold-primary)', padding: '0.75rem', borderRadius: '50%' }}>
                  <BookOpen size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Menu Pre-ordering</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Add appetizers & drinks ahead of schedule.</p>
                </div>
              </div>
            </div>

            {/* Room Discover Sections */}
            <div id="discover-sections" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: 'var(--gold-primary)', fontSize: '0.8rem', letterSpacing: '0.15em', fontWeight: 600 }}>DISCOVER AMBIANCE</span>
                <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', marginTop: '0.5rem' }}>Select Your Ideal Atmosphere</h2>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem'
              }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ height: '180px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-gold-soft)', borderRadius: '8px', backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url("/src/assets/luxury_dining.png")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Main Dining Foyer</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.5' }}>
                      Plush leather seating surrounding our grand piano. Ideal for formal anniversaries and corporate banquets.
                    </p>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ height: '180px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-gold-soft)', borderRadius: '8px', backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url("/src/assets/luxury_dining.png")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'hue-rotate(25deg) brightness(0.8)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Outdoor Garden Patio</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.5' }}>
                      Breathe in fresh air adjacent to our lit stone fountains. Perfect for breezy summer evening cocktails.
                    </p>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ height: '180px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-gold-soft)', borderRadius: '8px', backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url("/src/assets/luxury_dining.png")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'hue-rotate(60deg) brightness(0.6)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Private VIP Lounge</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.5' }}>
                      Exclusive sound-dampened booths with dedicated sommelier service. Subject to advance reservations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )) : null}

        {/* 2. BOOKING TAB */}
        {activeTab === 'book' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Upper grid containing calendar/hours and layout map */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: '1 1 350px' }}>
                <Scheduler />
              </div>

              <div style={{ flex: '2 1 550px' }}>
                <TableLayoutMap />
              </div>
            </div>

            {/* Food Menu Pre-ordering */}
            <FoodMenu />

            {/* Final Booking summary action card */}
            <div className="glass-panel animate-slide-in" style={{
              padding: '2rem',
              border: '1px solid var(--border-gold-glow)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              backgroundImage: 'linear-gradient(to right, rgba(212,175,55,0.03), transparent)'
            }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>Complete Reservation</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Date: <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{selectedDate}</span> at <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{selectedTime}</span> in <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{selectedZone}</span>
                </p>
                {selectedTables.length > 0 && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', marginTop: '0.2rem', fontWeight: 500 }}>
                    Selected Tables: {selectedTables.map(id => tables.find(t => t.id === id)?.name).join(', ')}
                  </p>
                )}
                {estimatedTotal > 0 && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Food Pre-order Total: <span style={{ color: 'var(--gold-light)', fontWeight: 'bold' }}>${estimatedTotal.toFixed(2)}</span>
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                {bookingError && (
                  <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldAlert size={14} />
                    <span>{bookingError}</span>
                  </span>
                )}

                {user ? (
                  <button 
                    onClick={handleFinalBooking}
                    className="btn-primary animate-pulse-gold"
                    style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}
                    disabled={selectedTables.length === 0}
                  >
                    <span>Confirm & Book Now</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sign in required to record your VIP ticket</span>
                    <button 
                      onClick={() => setAuthOpen(true)}
                      className="btn-primary"
                    >
                      <span>Log In to Book Table</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* 3. DASHBOARD TAB */}
        {activeTab === 'dashboard' && user && (
          <Dashboard />
        )}

        {/* 4. HOTEL SEARCH TAB */}
        {activeTab === 'hotels' && (
          <HotelSearch />
        )}

        {/* 5. HOTELS MAP TAB */}
        {activeTab === 'map' && (
          <HotelsMap />
        )}

        {/* 6. MY HOTEL BOOKINGS TAB */}
        {activeTab === 'my-bookings' && (
          <HotelBookings />
        )}

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '2rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        marginTop: 'auto',
        backgroundColor: '#070709'
      }}>
        <div style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', fontSize: '1rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          L'AMBROISIE PARIS
        </div>
        <div>© {new Date().getFullYear()} L'Ambroisie Inc. All rights reserved. Powered by React & Client State Engine.</div>
      </footer>

      {/* Auth overlay modal */}
      {authOpen && (
        <AuthPage onClose={() => setAuthOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ReservationProvider>
        <HotelProvider>
          <AppContent />
        </HotelProvider>
      </ReservationProvider>
    </AuthProvider>
  );
}
