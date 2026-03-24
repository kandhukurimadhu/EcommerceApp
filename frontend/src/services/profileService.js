import api from './api';

/**
 * Profile service — wraps all user profile API calls.
 */
const profileService = {
  get: ()                       => api.get('/api/profile'),
  update: (data)                => api.put('/api/profile', data),
  changePassword: (data)        => api.put('/api/profile/password', data),
};

export default profileService;
