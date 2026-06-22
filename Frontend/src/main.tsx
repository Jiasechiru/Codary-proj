import { BrowserRouter } from "react-router-dom"
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { syncThemeForPath } from './lib/theme'
import { LanguageProvider } from './lib/LanguageContext'
import { getStoredLanguage } from './lib/i18n'

syncThemeForPath(window.location.pathname)
document.documentElement.lang = getStoredLanguage()

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    {/* <StrictMode> */}
    <LanguageProvider>
      <App />
    </LanguageProvider>
    {/* </StrictMode> */}
  </BrowserRouter>
)
