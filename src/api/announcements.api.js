import client from './client'

export const listAnnouncements = () =>
  client.get('/announcements').then((r) => r.data.announcements)
export const createAnnouncement = (data) =>
  client.post('/announcements', data).then((r) => r.data.announcement)
export const updateAnnouncement = (id, data) =>
  client.patch(`/announcements/${id}`, data).then((r) => r.data.announcement)
export const deleteAnnouncement = (id) => client.delete(`/announcements/${id}`)
