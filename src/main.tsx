import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Tailwind CSS
import 'tailwindcss/tailwind.css'
import './index.css'
import App from './App.tsx'

createRoot(document. getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
