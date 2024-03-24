import { useEffect, useState } from "react";
import { ListAllFiles, deleteFileFromCollections } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const DeliveryFiles = () => { 

  const navigate = useNavigate();

  const [files , setFiles] = useState([])

  useEffect(() => {
    handleListAllFiles()
  }, [])

  function handleListAllFiles(){
    ListAllFiles()
    .then((res) => {
      if(res){
        setFiles(res)
      }
    })
  }

  function handleDeliveryFile(value){
    navigate("/notes", {state: {reviewFileNumber: value.toString()}})
  }

  function handleDeleteFile(value){
    deleteFileFromCollections(value)
    .then((res) => {
      if(res){
        handleListAllFiles()
        console.log("File deleted successfully")
      }else{
        console.log("Error deleting file")
      }
    })
  }
  
  return(
    <> 
      {files.length > 0 ?
        <div>
            <div className="flex items-center w-full justify-between text-center pl-4 mb-2 text-gray-500 bg-white rounded-lg border-2 shadow">
              <div className="flex items-center m-auto">
                Albaranes disponibles 
                <div className="inline-flex items-center justify-center ml-2 flex-shrink-0 w-8 h-8 m-2 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                  {files.length}
                </div> 
              </div>
            </div>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm table-fixed text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 ">
                        <tr>
                            <th scope="col" className="px-6 py-2 w-24">
                                ALBAR&aacute;n
                            </th>
                            <th scope="col" className="px-6 py-2 w-44">
                                Descripci&oacute;n
                            </th>
                            <th scope="col" className="px-6 py-2 w-screen">
                                Eliminar
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {files.map((item, index) => (
                      <tr className="bg-white border-b text-gray-900" key={item+"-"+index}>
                            <th scope="row" className="px-6 py-4 w-24 font-bold whitespace-nowrap">
                              <button 
                                id={item} 
                                className="hover:text-green-800"
                                onClick={() => handleDeliveryFile(item.number)}
                              >
                                {item.number}
                              </button>
                            </th>
                            <td className="px-6 py-2 w-44">
                              {item.description}
                            </td>
                            <td className="px-10 py-2 w-screen">
                              <button 
                                type="button" 
                                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-md text-sm px-2 py-0.5 text-center"
                                onClick={() => handleDeleteFile(item.number)}
                              >
                                X
                              </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

      </div>
      : <div className="flex items-center w-full text-center pl-4 text-gray-500 bg-white rounded-lg border-2 shadow">
          No hay albaranes disponibles
        </div>
      }
    </>
  )
 }

 export default DeliveryFiles;