import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, Clock, Compass, Hotel, Luggage } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { user, logout } = useAuth();

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      margin: '1rem',
      borderRadius: '16px',
      padding: '0.75rem 2rem',
      border: '1px solid var(--border-gold-soft)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Top bar removed per request */}

      {/* Main Navigation Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.6rem',
            fontWeight: 'bold',
            background: 'var(--gold-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.08em'
          }}>
            L'AMBROISIE
          </div>
        </div>

        {/* Center Menu */}
        <nav style={{
          display: 'flex',
          gap: '1.5rem'
        }}>
          <button 
            onClick={() => setActiveTab('home')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'home' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'home' ? '600' : '400',
              fontFamily: 'var(--font-sans)',
              transition: 'var(--transition-smooth)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Compass size={16} />
            <span>Discover</span>
          </button>

          <button 
            onClick={() => {
              if (user) {
                setActiveTab('book');
              } else {
                onOpenAuth();
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'book' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'book' ? '600' : '400',
              fontFamily: 'var(--font-sans)',
              transition: 'var(--transition-smooth)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Calendar size={16} />
            <span>Book a Table</span>
          </button>

          <button 
            onClick={() => setActiveTab('hotels')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'hotels' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'hotels' ? '600' : '400',
              fontFamily: 'var(--font-sans)',
              transition: 'var(--transition-smooth)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Hotel size={16} />
            <span>Hotels India</span>
          </button>

          

          {user && (
            <button 
              onClick={() => setActiveTab('dashboard')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'dashboard' ? 'var(--gold-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'dashboard' ? '600' : '400',
                fontFamily: 'var(--font-sans)',
                transition: 'var(--transition-smooth)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <User size={16} />
              <span>My Lounge</span>
            </button>
          )}

          {user && (
            <button 
              onClick={() => setActiveTab('my-bookings')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'my-bookings' ? 'var(--gold-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'my-bookings' ? '600' : '400',
                fontFamily: 'var(--font-sans)',
                transition: 'var(--transition-smooth)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Luggage size={16} />
              <span>My Hotels</span>
            </button>
          )}
        </nav>

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold-primary)' }}>
                  VIP Patron
                </span>
              </div>
              <button 
                onClick={logout}
                title="Sign Out"
                className="btn-secondary"
                style={{ padding: '0.5rem 0.75rem', borderRadius: '6px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="btn-primary"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', borderRadius: '6px' }}
            >
              Log In / Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
