import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/authContext.jsx'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
    <PayPalScriptProvider options ={{ "client-id": "AXW558Tu1Y2tzz9OJ7GuQuhTCHhV2yyJ5xvFkq-IuhO4UFmwhIrOMsOznB8qWJZyPEqDeaAkSrlIV06f" }}>
      
    <App />
    
    </PayPalScriptProvider>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
