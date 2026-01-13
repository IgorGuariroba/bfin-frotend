import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from './components/ui'
import App from './App.tsx'
import './index.css'
import { initializeSdk } from './config/sdk'

// Inicializar SDK do BFIN
initializeSdk()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
)
