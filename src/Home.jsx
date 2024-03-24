
import { useNavigate } from 'react-router-dom';
import DeliveryFiles from './components/DeliveryFiles';

function App() {

  const navigate = useNavigate()

  return (
    <>
    <div className='m-4'>
      <div className="bg-gray-50 dark:bg-gray-900 flex justify-between mb-4 pl-2 pr-2">
        <span className="self-center text-2xl text-blue-700 font-semibold whitespace-nowrap">Delivery Reviewer</span>
        <button className="rounded-md bg-blue-700 text-white text-sm pl-2 pr-2"
                onClick={() => navigate("/create")}
        >
          Cargar albar&aacute;n
        </button>
        <button onClick={() => logout()} className='text-sm mt-2 pl-2 pr-2 pt-1 pb-1 bg-red-400 border-2 border-red-700 rounded-md hover:bg-red-700 hover:text-white'>
          Salir
        </button>
      </div>
      <DeliveryFiles/>
    </div>
    </>
  )
}

export default App
