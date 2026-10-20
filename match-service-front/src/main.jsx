import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ClientProfileProvider from './context/ClientProfileProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClientProfileProvider>
      <App />
    </ClientProfileProvider>
  </StrictMode>,
)
