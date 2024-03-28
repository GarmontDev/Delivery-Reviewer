import "./DeliveryFiles.css"
import { useEffect, useState } from "react";
import { ListAllFiles, deleteFile, deleteFileFromCollections, updateIncidents } from "../../config/firebase.js";
import { useNavigate } from "react-router-dom";
import FileCheckIcon from "../../assets/icons/FileCheckIcon.jsx"
import AlertTriangleIcon from "../../assets/icons/AlertTriangleIcon.jsx"
import { useUserContext } from "../../context/UserContext.jsx";

const DeliveryFiles = () => { 

  const navigate = useNavigate();
  const {user} = useUserContext();

  const [files , setFiles] = useState([])

  useEffect(() => {
    handleListAllFiles()
  }, [])

  function handleListAllFiles(){
    ListAllFiles()
    .then((res) => {
      if(res){
        res.forEach(element => {
          updateIncidents(element.number)
        });
        setFiles(res)
      }
    })
  }

  function handleDeliveryFile(value){
    navigate("/notes", {state: {reviewFileNumber: value.toString()}})
  }

  function handleDeleteFile(value){

    deleteFile(value)
    .then((res) => {
      if(res){
        console.log("Lines of "+ value +" deleted successfully")
      }
    })
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
        <div className="delivery-files-main-container">
            <div className="container">
              <div className="flex items-center m-auto">
                Albaranes disponibles 
                <div className="files-counter">
                  {files.length}
                </div> 
                <button 
                  className="bg-blue-500 text-white text-sm rounded-md p-1 ml-6"
                  onClick={() => {handleListAllFiles()}}
                >
                  Refresh
                </button>
              </div>
            </div>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm table-fixed text-left text-gray-500">
                    <thead className="text-sm text-gray-700  bg-gray-200 ">
                        <tr>
                            <th scope="col" className="px-6 py-2 w-24">
                                Albar&aacute;n
                            </th>
                            <th scope="col" className="px-2 py-2 w-24">
                                Descripci&oacute;n
                            </th>
                            <th scope="col" className="px-1 py-2 w-10">
                                Incidenc.
                            </th>
                            <th scope="col" className="px-8 py-2 w-10">
                                Revisado
                            </th>
                            <th scope="col" className="px-8 py-2 w-6">
                                Eliminar
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {files.map((item, index) => (
                      <tr className="bg-white border-b text-gray-900" key={item+"-"+index}>
                            <th scope="row" className="px-4 py-4 w-24 font-bold whitespace-nowrap">
                              <button 
                                id={item} 
                                className="hover:text-green-800"
                                onClick={() => handleDeliveryFile(item.number)}
                              >
                                {item.number}
                              </button>
                            </th>
                            <td className="px-2 py-2 w-24">
                              {item.description}
                            </td>
                            <td className="px-6 py-2 w-10">
                              {item.incidents ? <AlertTriangleIcon/> : ""}
                            </td>
                            <td className="px-12 py-2 w-10">
                              {item.completed ? <FileCheckIcon/> : ""}
                            </td>
                            <td className="px-10 py-2 w-6">
                              {user.email === "garmontdev@gmail.com"? 
                                <button 
                                  type="button" 
                                  className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-md text-sm px-2 py-0.5 text-center"
                                  onClick={() => {if (window.confirm("Seguro que deseas eliminar este albarán?")) handleDeleteFile(item.number) }} 
                                >
                                  X
                                </button>
                                : ""
                              }
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