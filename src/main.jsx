import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ProgressProvider } from './context/ProgressContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProgressProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ProgressProvider>
  </StrictMode>,
)
