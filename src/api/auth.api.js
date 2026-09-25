import client from './client'

export const register = (data) => client.post('/auth/register', data).then((r) => r.data)
export const login = (data) => client.post('/auth/login', data).then((r) => r.data)
export const adminLogin = (data) => client.post('/auth/admin-login', data).then((r) => r.data)
export const forgotPassword = (data) =>
  client.post('/auth/forgot-password', data).then((r) => r.data)
export const resetPassword = (data) =>
  client.post('/auth/reset-password', data).then((r) => r.data)
export const getMe = () => client.get('/auth/me').then((r) => r.data)
export const updateProfile = (data) => client.patch('/auth/profile', data).then((r) => r.data)
