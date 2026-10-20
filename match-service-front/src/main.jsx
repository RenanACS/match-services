import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ClientProfileProvider from './context/ClientProfileProvider.jsx'
import AuthProvider from './context/auth/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ClientProfileProvider>
        <App />
      </ClientProfileProvider>
    </AuthProvider>
  </StrictMode>,
)
