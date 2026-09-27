import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { CurrencyProvider } from './context/CurrencyContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster position="top-right" />
          </BrowserRouter>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  )
}

export default App
