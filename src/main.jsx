import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Import export diagnostics for console access (dev mode)
import './utils/exportDiagnostics'

// Import toast provider for notifications
import { ToastProvider } from './components/ui/Toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
)







