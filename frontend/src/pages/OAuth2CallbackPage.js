import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

/**
 * OAuth2CallbackPage — receives the JWT token from the backend redirect
 * after a successful Google SSO login, stores it, and navigates to dashboard.
 *
 * URL pattern: /oauth2/callback?token=<jwt>
 */
export default function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      toast.error('SSO login failed. Please try again.');
      navigate('/login');
      return;
    }

    loginWithToken(token)
      .then(() => {
        toast.success('Logged in with Google!');
        navigate('/dashboard');
      })
      .catch(() => {
        toast.error('SSO login failed. Please try again.');
        navigate('/login');
      });
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div className="spinner" style={{ width: 48, height: 48 }} />
      <p style={{ color: 'var(--text-secondary)' }}>Completing sign-in…</p>
    </div>
  );
}
