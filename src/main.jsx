import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Verificação segura do elemento root
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento root não encontrado! Verifique o index.html')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
