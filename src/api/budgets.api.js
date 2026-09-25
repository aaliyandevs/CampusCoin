import client from './client'

export const listBudgets = (params) =>
  client.get('/budgets', { params }).then((r) => r.data.budgets)
export const setBudget = (data) => client.post('/budgets', data).then((r) => r.data.budget)
export const updateBudget = (id, data) =>
  client.patch(`/budgets/${id}`, data).then((r) => r.data.budget)
export const deleteBudget = (id) => client.delete(`/budgets/${id}`)
