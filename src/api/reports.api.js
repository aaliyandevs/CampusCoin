import client from './client'

export const getCategorySummary = (params) =>
  client.get('/reports/category-summary', { params }).then((r) => r.data)
export const getIncomeVsExpense = (params) =>
  client.get('/reports/income-vs-expense', { params }).then((r) => r.data.months)
export const getDailySummary = (params) =>
  client.get('/reports/daily-summary', { params }).then((r) => r.data.days)
export const getWeeklySummary = (params) =>
  client.get('/reports/weekly-summary', { params }).then((r) => r.data.weeks)
