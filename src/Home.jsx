import "./index.css"
import { useNavigate } from 'react-router-dom';
import DeliveryFiles from './components/DeliveryFiles/DeliveryFiles';
import { logout } from './config/firebase';
import FaviconIcon from './assets/icons/FaviconIcon';
import { useUserContext } from "./context/UserContext";
import { useEffect } from "react";
import Footer from "./components/Footer";
import EmployeeSelection from "./components/EmployeeSelection/EmployeeSelection";
import { useEmployeeContext } from "./context/EmployeeContext";
import secureLocalStorage from "react-secure-storage";

function Home() {

  const navigate = useNavigate()

  const {user} = useUserContext();
  const {employee, setEmployee} = useEmployeeContext()

  useEffect(() => {
    if (!user){
      navigate('/');
    }
  }, [user])

  useEffect(() => {
    setEmployee(JSON.parse(secureLocalStorage.getItem("employee")))
  }, [])

  return (
    <>
      <div className='home-container'>
        <div className="header-container">
          <div className="header-icon">
            <FaviconIcon size={32}/>
            Delivery Reviewer
          </div>

          <button 
            onClick={() => {if (window.confirm("Seguro que deseas salir?")) logout() }} 
            className='text-sm pl-2 pr-2 mr-2 pt-1 pb-1 bg-red-500 text-white border-2 border-red-500 rounded-md hover:bg-red-700 hover:text-white'>
            Salir
          </button>
        </div>
        {employee
          ? <DeliveryFiles employee={employee} setEmployee={setEmployee}/>
          : <EmployeeSelection setEmployee={setEmployee}/>
        }
        
        <Footer/>
      </div>
    </>
  )
}

export default Home
