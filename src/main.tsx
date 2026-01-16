import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from './components/ui'
import App from './App.tsx'
import './index.css'
import { initializeSdk } from './config/sdk'

// Inicializar SDK do BFIN
initializeSdk()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
)
