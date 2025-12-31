import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppProvider from './providers/AppProvider'
import { NotificationContainer } from './components/common'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
      <NotificationContainer />
    </AppProvider>
  </StrictMode>,
)
