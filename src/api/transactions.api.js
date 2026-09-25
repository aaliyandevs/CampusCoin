import client from './client'

export const listTransactions = (params) =>
  client.get('/transactions', { params }).then((r) => r.data.transactions)
export const createTransaction = (data) =>
  client.post('/transactions', data).then((r) => r.data.transaction)
export const updateTransaction = (id, data) =>
  client.patch(`/transactions/${id}`, data).then((r) => r.data.transaction)
export const deleteTransaction = (id) => client.delete(`/transactions/${id}`)
export const importTransactionsCsv = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return client
    .post('/transactions/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data)
}
