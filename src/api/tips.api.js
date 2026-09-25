import client from './client'

export const listTips = (params) => client.get('/tips', { params }).then((r) => r.data.tips)
export const pinTip = (id) => client.patch(`/tips/${id}/pin`).then((r) => r.data.tip)
export const dismissTip = (id) => client.patch(`/tips/${id}/dismiss`).then((r) => r.data.tip)
