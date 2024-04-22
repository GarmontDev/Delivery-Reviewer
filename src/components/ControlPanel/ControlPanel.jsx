import { useState } from "react"
import CreateFile from "../CreateFile/CreateFile"

const ControlPanel = () => { 

  const [activeTab, setActiveTab] = useState(0)

  return(
    <>
      <ul className="flex flex-wrap text-sm pt-2 font-medium text-center text-gray-500 border-b border-gray-200">
          <li className="me-2">
              <button
                onClick={() => setActiveTab(0)}
                className="inline-block p-2 text-gray-800 bg-gray-100 rounded-t-lg hover:bg-blue-600 hover:text-gray-100"
              >
                Subir albar&aacute;n
              </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab(1)}
              className="inline-block p-2 text-blue-600 bg-gray-100 rounded-t-lg hover:bg-blue-600 hover:text-gray-100"
            >
              Actualizar c&oacute;digos de barras
            </button>
          </li>
      </ul>
      <div>
        {activeTab === 0 ? 
          <CreateFile/>
          : ""
        }
      </div>
    </>
  )
 }

 export default ControlPanel