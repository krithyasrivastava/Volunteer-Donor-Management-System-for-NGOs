import api from './api';

// ---- Auth ----
export const authService = {
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data)
};

// ---- Volunteers ----
export const volunteerService = {
  list: (params) => api.get('/volunteers', { params }).then((r) => r.data),
  get: (id) => api.get(`/volunteers/${id}`).then((r) => r.data),
  create: (payload) => api.post('/volunteers', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/volunteers/${id}`, payload).then((r) => r.data),
  setStatus: (id, status) => api.patch(`/volunteers/${id}/status`, { status }).then((r) => r.data),
  remove: (id) => api.delete(`/volunteers/${id}`).then((r) => r.data),
  myProfile: () => api.get('/volunteers/me/profile').then((r) => r.data),
  updateMyProfile: (payload) => api.put('/volunteers/me/profile', payload).then((r) => r.data)
};

// ---- Donors ----
export const donorService = {
  list: (params) => api.get('/donors', { params }).then((r) => r.data),
  get: (id) => api.get(`/donors/${id}`).then((r) => r.data),
  create: (payload) => api.post('/donors', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/donors/${id}`, payload).then((r) => r.data),
  myProfile: () => api.get('/donors/me/profile').then((r) => r.data),
  updateMyProfile: (payload) => api.put('/donors/me/profile', payload).then((r) => r.data)
};

// ---- Events ----
export const eventService = {
  list: (params) => api.get('/events', { params }).then((r) => r.data),
  get: (id) => api.get(`/events/${id}`).then((r) => r.data),
  create: (payload) => api.post('/events', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/events/${id}`, payload).then((r) => r.data),
  cancel: (id) => api.delete(`/events/${id}`).then((r) => r.data),
  setRequirements: (id, requirements) => api.put(`/events/${id}/requirements`, { requirements }).then((r) => r.data),
  matches: (id) => api.get(`/events/${id}/matches`).then((r) => r.data),
  assign: (id, volunteer_id) => api.post(`/events/${id}/assign`, { volunteer_id }).then((r) => r.data),
  apply: (id) => api.post(`/events/${id}/apply`).then((r) => r.data),
  updateVolunteer: (id, volunteerId, payload) =>
    api.patch(`/events/${id}/volunteers/${volunteerId}`, payload).then((r) => r.data)
};

// ---- Donations ----
export const donationService = {
  list: (params) => api.get('/donations', { params }).then((r) => r.data),
  mine: () => api.get('/donations/mine').then((r) => r.data),
  get: (id) => api.get(`/donations/${id}`).then((r) => r.data),
  receipt: (id) => api.get(`/donations/${id}/receipt`).then((r) => r.data),
  create: (payload) => api.post('/donations', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/donations/${id}`, payload).then((r) => r.data)
};

// ---- Skills ----
export const skillService = {
  list: () => api.get('/skills').then((r) => r.data),
  create: (payload) => api.post('/skills', payload).then((r) => r.data),
  mine: () => api.get('/skills/mine').then((r) => r.data),
  addMine: (payload) => api.post('/skills/mine', payload).then((r) => r.data),
  removeMine: (skillId) => api.delete(`/skills/mine/${skillId}`).then((r) => r.data)
};

// ---- Applications ----
export const applicationService = {
  volunteers: () => api.get('/applications/volunteers').then((r) => r.data),
  events: () => api.get('/applications/events').then((r) => r.data),
  mine: () => api.get('/applications/mine').then((r) => r.data)
};

// ---- Dashboard ----
export const dashboardService = {
  admin: () => api.get('/dashboard/admin').then((r) => r.data),
  volunteer: () => api.get('/dashboard/volunteer').then((r) => r.data),
  donor: () => api.get('/dashboard/donor').then((r) => r.data),
  reports: () => api.get('/dashboard/reports').then((r) => r.data)
};
