import { createContext, useContext, useEffect, useState } from 'react'

const THEME_KEY = 'campuscoin_theme'
const FONT_SIZE_KEY = 'campuscoin_font_size'

const FONT_SIZE_CLASSES = { normal: '', large: 'text-lg', larger: 'text-xl' }

const ThemeContext = createContext(null)

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // ignore storage access errors
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialFontSize() {
  try {
    const stored = localStorage.getItem(FONT_SIZE_KEY)
    if (stored in FONT_SIZE_CLASSES) return stored
  } catch {
    // ignore storage access errors
  }
  return 'normal'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)
  const [fontSize, setFontSize] = useState(getInitialFontSize)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // ignore storage access errors
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.style.fontSize =
      fontSize === 'large' ? '17px' : fontSize === 'larger' ? '19px' : ''
    try {
      localStorage.setItem(FONT_SIZE_KEY, fontSize)
    } catch {
      // ignore storage access errors
    }
  }, [fontSize])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
