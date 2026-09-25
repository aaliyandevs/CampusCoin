import client from './client'

export const listUsers = () => client.get('/admin/users').then((r) => r.data.users)
export const toggleDisableUser = (id) =>
  client.patch(`/admin/users/${id}/disable`).then((r) => r.data.user)
export const resetUserPassword = (id) => client.post(`/admin/users/${id}/reset-password`)
export const getAdminStats = () => client.get('/admin/stats').then((r) => r.data)

export const listDefaultCategories = () =>
  client.get('/admin/categories').then((r) => r.data.categories)
export const createDefaultCategory = (data) =>
  client.post('/admin/categories', data).then((r) => r.data.category)
export const updateDefaultCategory = (id, data) =>
  client.patch(`/admin/categories/${id}`, data).then((r) => r.data.category)
export const deleteDefaultCategory = (id) => client.delete(`/admin/categories/${id}`)
