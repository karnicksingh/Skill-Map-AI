// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import{RouterProvider} from "react-router"
// import {router} from "./app.router.jsx"
// import App from './App.jsx'
// import './style.css'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//    <RouterProvider router={router} />
//   </StrictMode>,
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {Toaster} from "sonner"
import './style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster richColors position="top-right" />
    <App />
  </StrictMode>,
)