import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import profileService from '../services/profileService';
import './ProfilePage.css';

/**
 * Profile page — allows users to:
 * - View their profile info
 * - Update their details (name, email, phone)
 * - Change their password
 */
export default function ProfilePage() {
  const { user, isAdmin, updateUser } = useAuth();

  const [profile, setProfile]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [activeTab, setActiveTab]     = useState('info');

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '',
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  // Load profile from API
  useEffect(() => {
    profileService.get()
      .then(res => {
        setProfile(res.data);
        setForm({
          firstName:   res.data.firstName   || '',
          lastName:    res.data.lastName    || '',
          email:       res.data.email       || '',
          phoneNumber: res.data.phoneNumber || '',
        });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleFormChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePwChange   = (e) => setPwForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileService.update(form);
      setProfile(res.data);
      updateUser({ ...user, ...form });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await profileService.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const getInitial = () => (profile?.username || 'U')[0].toUpperCase();
  const fullName   = () => [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || profile?.username;

  if (loading) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="loading-center" style={{ minHeight: 400 }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="profile-main">
        <div className="container">

          {/* Profile Hero */}
          <div className="profile-hero fade-in">
            <div className="profile-avatar-lg">
              {profile?.profilePicture
                ? <img src={profile.profilePicture} alt={profile.username} />
                : <span>{getInitial()}</span>
              }
            </div>
            <div className="profile-hero-info">
              <h1 className="profile-name">{fullName()}</h1>
              <p className="profile-username">@{profile?.username}</p>
              <div className="profile-meta-chips">
                <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
                  {isAdmin ? '⚙️ Admin' : '👤 User'}
                </span>
                {profile?.provider && profile.provider !== 'local' && (
                  <span className="chip-provider">
                    {profile.provider === 'google' ? '🔵 Google SSO' : profile.provider}
                  </span>
                )}
                {profile?.email && (
                  <span className="chip-email">✉️ {profile.email}</span>
                )}
              </div>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="profile-tabs fade-in">
            <button className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}>
              👤 Personal Info
            </button>
            {(!profile?.provider || profile.provider === 'local') && (
              <button className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}>
                🔒 Change Password
              </button>
            )}
            <button className={`profile-tab ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}>
              ℹ️ Account Details
            </button>
          </div>

          {/* Tab content */}
          <div className="profile-content fade-in">

            {/* Personal Info Tab */}
            {activeTab === 'info' && (
              <div className="profile-section">
                <h2 className="section-title">Personal Information</h2>
                <p className="section-desc">Update your name, email, and contact details.</p>

                <form onSubmit={handleProfileSave} className="profile-form">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input name="firstName" value={form.firstName} onChange={handleFormChange}
                        className="form-input" placeholder="John" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input name="lastName" value={form.lastName} onChange={handleFormChange}
                        className="form-input" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input name="email" type="email" value={form.email} onChange={handleFormChange}
                      className="form-input" placeholder="john@example.com" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleFormChange}
                      className="form-input" placeholder="+91 9876543210" />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="profile-section">
                <h2 className="section-title">Change Password</h2>
                <p className="section-desc">Keep your account secure with a strong password.</p>

                <form onSubmit={handlePasswordChange} className="profile-form">
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input name="currentPassword" type="password" value={pwForm.currentPassword}
                      onChange={handlePwChange} className="form-input" placeholder="Enter current password" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input name="newPassword" type="password" value={pwForm.newPassword}
                      onChange={handlePwChange} className="form-input" placeholder="Min. 6 characters" required minLength={6} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input name="confirmPassword" type="password" value={pwForm.confirmPassword}
                      onChange={handlePwChange} className="form-input" placeholder="Repeat new password" required />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? 'Updating…' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Account Details Tab */}
            {activeTab === 'account' && (
              <div className="profile-section">
                <h2 className="section-title">Account Details</h2>
                <p className="section-desc">Read-only information about your account.</p>

                <div className="account-info-grid">
                  <InfoRow label="Username" value={`@${profile?.username}`} />
                  <InfoRow label="Role" value={isAdmin ? 'Administrator' : 'Standard User'} />
                  <InfoRow label="Account Status" value="Active ✓" highlight />
                  <InfoRow label="Auth Provider" value={profile?.provider === 'google' ? 'Google SSO' : 'Local (Password)'} />
                  <InfoRow label="User ID" value={`#${profile?.id}`} />
                </div>

                <div className="rbac-info-box">
                  <h3>🛡️ Your Permissions</h3>
                  <div className="rbac-list">
                    <PermRow label="View Products" allowed={true} />
                    <PermRow label="Add to Cart"   allowed={true} />
                    <PermRow label="Add Products"    allowed={isAdmin} />
                    <PermRow label="Edit Products"   allowed={isAdmin} />
                    <PermRow label="Delete Products" allowed={isAdmin} />
                    <PermRow label="Admin Panel"     allowed={isAdmin} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className={`info-value ${highlight ? 'text-success' : ''}`}>{value}</span>
    </div>
  );
}

function PermRow({ label, allowed }) {
  return (
    <div className="perm-row">
      <span className={allowed ? 'perm-check' : 'perm-cross'}>{allowed ? '✓' : '✗'}</span>
      <span className="perm-label" style={{ color: allowed ? 'var(--text-primary)' : 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  );
}
