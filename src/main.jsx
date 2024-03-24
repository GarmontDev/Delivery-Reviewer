import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { router } from "./router" 
import { RouterProvider } from 'react-router-dom'
import UserContextProvider from './context/UserContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
      <RouterProvider router={router}/>
    </UserContextProvider>
  </React.StrictMode>,
)
