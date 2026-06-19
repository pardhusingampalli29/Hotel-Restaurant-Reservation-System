import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, AlertCircle, Sparkles } from 'lucide-react';

export default function AuthPage({ onClose }) {
  const { login, signup, loginAdmin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Feedback
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (isLogin) {
      if (isAdminMode) {
        const res = loginAdmin(email, password);
        if (res.success) {
          onClose();
          setLoading(false);
          return;
        } else {
          setError(res.error);
          setLoading(false);
          return;
        }
      }
      // Regular user login
      const res = login(email, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.error);
      }
    } else {
      if (!name) {
        setError('Please enter your name.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }
      const res = signup(name, email, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.error);
      }
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(5, 5, 7, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fade-in 0.3s ease-out'
    }}>
      <div 
        className="glass-panel" 
        style={{
          width: '90%',
          maxWidth: '450px',
          padding: '2.5rem',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          border: '1px solid var(--border-gold-glow)',
          animation: 'slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.25rem',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <X size={20} />
        </button>

        {/* Heading */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            color: 'var(--gold-primary)',
            marginBottom: '0.5rem'
          }}>
            <Sparkles size={28} className="gold-text-glow animate-float" />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {isAdminMode ? 'Admin Console Login' : (isLogin ? 'Welcome Back' : 'Join the Club')}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {isAdminMode ? 'Enter admin credentials to access the admin panel' : (isLogin ? 'Enter your details to access your lounge' : 'Create an account to start reserving fine dining')}
          </p>
        </div>

        {/* Admin toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {!isAdminMode ? (
            <button onClick={() => { setIsAdminMode(true); setIsLogin(true); setError(''); setEmail(''); setPassword(''); }} style={{ background: 'transparent', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer' }}>
              Admin Login
            </button>
          ) : (
            <button onClick={() => { setIsAdminMode(false); setError(''); setEmail(''); setPassword(''); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Back to User Login
            </button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--color-danger)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#ff8a8a',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Jean-Luc Picard" 
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="vip@ambroisie.com" 
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ marginTop: '0.5rem', width: '100%' }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        {/* Footer Toggle */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)', 
          marginTop: '0.5rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '1rem'
        }}>
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <span 
                onClick={() => { setIsLogin(false); setError(''); }}
                style={{ color: 'var(--gold-primary)', cursor: 'pointer', fontWeight: 600 }}
              >
                Sign Up Now
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span 
                onClick={() => { setIsLogin(true); setError(''); }}
                style={{ color: 'var(--gold-primary)', cursor: 'pointer', fontWeight: 600 }}
              >
                Log In Now
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
