import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = loginAdmin(email.trim(), password);
    if (res.success) {
      setMessage('Admin signed in successfully.');
    } else {
      setMessage(res.error || 'Failed to sign in.');
    }
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="admin email"
        type="email"
        style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'var(--text-primary)' }}
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        type="password"
        style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'var(--text-primary)' }}
      />
      <button type="submit" className="btn-primary" style={{ padding: '0.6rem 0.9rem' }}>Admin Login</button>
      {message && <div style={{ color: message.includes('successfully') ? '#22c55e' : '#ef4444', fontSize: '0.9rem' }}>{message}</div>}
    </form>
  );
}
