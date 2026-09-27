import { createContext, useContext, useEffect, useState } from 'react'
import { formatCurrency, getStoredCurrency, setStoredCurrency } from '../utils/format'

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(getStoredCurrency)

  useEffect(() => {
    setStoredCurrency(currency)
  }, [currency])

  const toggleCurrency = () => setCurrency((c) => (c === 'USD' ? 'PKR' : 'USD'))
  const format = (amountInUsd) => formatCurrency(amountInUsd, currency)

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
