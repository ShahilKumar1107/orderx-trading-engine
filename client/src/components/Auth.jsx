import { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/auth';

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('Email and password required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = mode === 'login'
        ? `${BASE_URL}/login`
        : `${BASE_URL}/register`;

      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await axios.post(url, body);

      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
  name: res.data.user.name,
  email: res.data.user.email
}));

      // Tell App.jsx user is logged in
      onLogin(res.data.user, res.data.token);

    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#16213e',
        border: '1px solid #0f3460',
        borderRadius: '8px',
        padding: '40px',
        width: '360px'
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#4f8ef7' }}>
            ⚡ OrderX <span style={{ color: '#f7931a' }}>₿</span>
          </div>
          <div style={{ color: '#8b949e', fontSize: '12px', marginTop: '4px' }}>
            Real-time Crypto Trading Engine
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          background: '#0f3460',
          borderRadius: '4px',
          padding: '3px',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '3px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              background: mode === 'login' ? '#4f8ef7' : 'transparent',
              color: mode === 'login' ? '#fff' : '#8b949e'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '3px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              background: mode === 'register' ? '#4f8ef7' : 'transparent',
              color: mode === 'register' ? '#fff' : '#8b949e'
            }}
          >
            Register
          </button>
        </div>

        {/* Form */}
        {mode === 'register' && (
          <div className="form-row">
            <label>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Shahil Kumar"
            />
          </div>
        )}

        <div className="form-row">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </div>

        <div className="form-row">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p style={{ color: '#f85149', fontSize: '12px', marginBottom: '12px' }}>
            ❌ {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: '#4f8ef7',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginTop: '8px'
          }}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Login →' : 'Create Account →'}
        </button>
      </div>
    </div>
  );
}