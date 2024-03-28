import "./index.css"
import { useNavigate } from 'react-router-dom';
import DeliveryFiles from './components/DeliveryFiles/DeliveryFiles';
import { logout } from './config/firebase';
import FaviconIcon from './assets/icons/FaviconIcon';
import { useUserContext } from "./context/UserContext";
import { useEffect } from "react";

function Home() {

  const navigate = useNavigate()

  const {user} = useUserContext();

  useEffect(() => {
    if (!user){
      navigate('/');
    }
  }, [user])

  return (
    <>
      <div className='home-container'>
        <div className="header-container">
          <div className="header-icon">
            <FaviconIcon size={32}/>
            Delivery Reviewer
          </div>
          <button className="rounded-md bg-blue-700 text-white text-sm pl-2 pr-2 pt-1 pb-1"
                  onClick={() => navigate("/create")}
          >
            +Albar&aacute;n
          </button>
          <button onClick={() => logout()} className='text-sm pl-2 pr-2 pt-1 pb-1 bg-red-500 text-white border-2 border-red-500 rounded-md hover:bg-red-700 hover:text-white'>
            Salir
          </button>
        </div>
        <DeliveryFiles/>
      </div>
    </>
  )
}

export default Home
