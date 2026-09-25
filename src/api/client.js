import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('campuscoin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('campuscoin_token')
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default client
