import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

/**
 * Registration page — new users sign up with ROLE_USER by default.
 */
export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '', password: '', email: '', firstName: '', lastName: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob blob-1" />
        <div className="auth-blob blob-2" />
      </div>

      <div className="auth-card fade-in">
        <div className="auth-logo">
          <span className="logo-icon-lg">⚡</span>
          <h1 className="auth-brand">BusyBrains<span>Shop</span></h1>
        </div>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Join and start shopping today</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="name-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange}
                className="form-input" placeholder="John" />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange}
                className="form-input" placeholder="Doe" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Username *</label>
            <input name="username" value={form.username} onChange={handleChange}
              className="form-input" placeholder="johndoe" required minLength={3} />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className="form-input" placeholder="john@example.com" required />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              className="form-input" placeholder="Min. 6 characters" required minLength={6} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="btn-google" onClick={handleGoogleLogin}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
