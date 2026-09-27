import client from './client'

export const getCurrentInsight = () => client.get('/insights/current').then((r) => r.data.insight)
export const toggleInsightBookmark = (id) =>
  client.patch(`/insights/${id}/bookmark`).then((r) => r.data.insight)
