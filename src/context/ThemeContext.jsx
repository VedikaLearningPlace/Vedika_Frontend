import { createContext, useContext, useEffect, useState } from 'react'
const Ctx = createContext()
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('vlp-theme') || 'dark')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('vlp-theme', theme)
  }, [theme])
  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}
export const useTheme = () => useContext(Ctx)