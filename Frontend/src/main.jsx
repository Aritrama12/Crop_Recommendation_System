import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from "./context/ThemeContext";
import "./scss/index.scss";
createRoot(document.getElementById('root')).render(
  <StrictMode>

    <ThemeProvider>
      <App />
    </ThemeProvider>
   
  </StrictMode>,
)
