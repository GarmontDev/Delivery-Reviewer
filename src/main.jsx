import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { router } from "./router" 
import { RouterProvider } from 'react-router-dom'
import UserContextProvider from './context/UserContext.jsx'
import EmployeeContextProvider from './context/EmployeeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
      <EmployeeContextProvider>
        <RouterProvider router={router}/>
      </EmployeeContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
)
