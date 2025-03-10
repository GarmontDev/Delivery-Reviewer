import { useNavigate } from "react-router-dom";
import FaviconIcon from "../assets/icons/FaviconIcon";

const Page404 = () => { 

  const navigate = useNavigate();

  return (
    <>
      <div className="header-container m-4">
        <div className="header-icon">
          <FaviconIcon size={32}/>
          Delivery Reviewer
        </div>
      </div>
      <div className="grid grid-rows-2 mt-6 place-items-center">
        <h1 className="w-2/3">
          La p&aacute;gina que est&aacute;s buscando no est&aacute; disponible.
        </h1>
        <button 
          className="bg-blue-600 text-white font-medium rounded-sm w-32 p-2" 
          onClick={() => navigate("/")}
        >
          Volver al Inicio
        </button>
      </div>
    
    </>
  )
 }

 export default Page404