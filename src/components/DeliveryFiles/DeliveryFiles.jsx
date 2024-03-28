import "./DeliveryFiles.css"
import { useEffect, useState } from "react";
import { ListAllFiles, deleteFile, deleteFileFromCollections, updateIncidents, updateUserProfile } from "../../config/firebase.js";
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
        <div className="delivery-files-container">
          <div className="user-name">
            {user.displayName}
          </div>
          <button className="rounded-md bg-blue-700 text-white text-sm pl-2 pr-2 h-6 mt-1"
                  onClick={() => navigate("/create")}
          >
            Subir Albar&aacute;n
          </button>
          <button 
            className="bg-blue-500 text-white text-sm rounded-md pl-2 pr-2 h-6 mt-1 mr-4"
            onClick={() => {handleListAllFiles()}}
          >
            Refresh
          </button>
        </div>
      {files.length > 0 ?
        <div className="relative overflow-x-auto delivery-files-main-container">
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
                      {user.displayName === "Carlos"? 
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
      : <div className="no-files-available">
          No hay albaranes disponibles
        </div>
      }
    </>
  )
 }

 export default DeliveryFiles;