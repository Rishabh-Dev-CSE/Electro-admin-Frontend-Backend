import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRoute from './AppRoute'
import './index.css'
import './App.css'
import { AuthProvider } from './module/content/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoute />
    </AuthProvider>
  </React.StrictMode>
)
