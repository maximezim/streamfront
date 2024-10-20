import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrokerProvider } from './broker_context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrokerProvider>
      <App />
    </BrokerProvider>
  </StrictMode>,
)
