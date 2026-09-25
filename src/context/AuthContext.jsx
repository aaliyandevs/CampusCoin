import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth.api'

const TOKEN_KEY = 'campuscoin_token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }
    authApi
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoading(false))
  }, [])

  const applySession = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token)
    setUser(data.user)
  }

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials)
    applySession(data)
    return data.user
  }, [])

  const adminLogin = useCallback(async (credentials) => {
    const data = await authApi.adminLogin(credentials)
    applySession(data)
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload)
    applySession(data)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const data = await authApi.getMe()
    setUser(data.user)
    return data.user
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, adminLogin, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
