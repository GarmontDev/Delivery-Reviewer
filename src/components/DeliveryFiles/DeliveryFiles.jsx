import "./DeliveryFiles.css"
import { useEffect, useState } from "react";
import { ListAllFiles, deleteFile, deleteFileFromCollections, fetchVisibleFiles, updateFile, updateIncidents, updateUserProfile } from "../../config/firebase.js";
import { useNavigate } from "react-router-dom";
import FileCheckIcon from "../../assets/icons/FileCheckIcon.jsx"
import AlertTriangleIcon from "../../assets/icons/AlertTriangleIcon.jsx"
import { EyeOpenIcon } from "../../assets/icons/EyeIcon.jsx";
import { EyeOffIcon } from "../../assets/icons/EyeIcon.jsx";

const DeliveryFiles = ({employee, setEmployee}) => { 

  const navigate = useNavigate();

  const [files , setFiles] = useState([])
  const [filteredFiles, setFilteredFiles] = useState(null)
  const [showVisibleFiles, setShowVisibleFiles] = useState(true)

  useEffect(() => {
    handleListAllFiles(true)
  }, [])

  // useEffect(() => {
  //   setFilteredFiles(files)
  // }, [files])

  // useEffect(() => {
  //   filterVisibleFiles(showVisibleFiles)
  // }, [files])

  function handleListAllFiles(visible){
    ListAllFiles(visible)
    .then((res) => {
      if(res){
        res.forEach(element => {
          updateIncidents(element.number)
        });
        setFiles(res)
      }
    })
  }

  // function filterVisibleFiles(value){
  //   setFilteredFiles(files.filter((item) => item.visible === value))
  // }

  function handleDeliveryFile(value){
    navigate("/notes", {state: {reviewFileNumber: value.toString()}})
  }

  function handleDeleteFile(value){
    deleteFile(value)
    .then((res) => {
      if(res){
        deleteFileFromCollections(value)
        .then((res) => {
          if(res){
            handleListAllFiles(showVisibleFiles)
            alert("File deleted successfully")
          }else{
            alert("Error deleting file")
          }
        })
      }
    })
  }
  
  return(
    <> 
        <div className="delivery-files-container">
          <button className="user-name" onClick={() => (navigate("/home"),setEmployee(""))}>
            {employee ? employee.name : "No user selected"}
          </button>
          {employee.admin 
            ? !showVisibleFiles
                  ? <button className="rounded-md bg-blue-700 text-white text-sm pl-2 pr-2 h-6 mt-1"
                      onClick={() => (handleListAllFiles(true), setShowVisibleFiles(true))}
                    >
                      Visibles
                    </button>
                  : <button className="rounded-md bg-blue-700 text-white text-sm pl-2 pr-2 h-6 mt-1"
                      onClick={() => (handleListAllFiles(false), setShowVisibleFiles(false))}
                    >
                      Ver ocultos
                    </button>
            : ""
          }
          {employee.admin ?
            <button className="rounded-md bg-blue-700 text-white text-sm pl-2 pr-2 h-6 mt-1"
              onClick={() => navigate("/create")}
            >
              Subir Albar&aacute;n
            </button>
            : ""
          }

          <button 
            className="bg-blue-500 text-white text-sm rounded-md pl-2 pr-2 h-6 mt-1 mr-4"
            onClick={() => {handleListAllFiles(showVisibleFiles)}}
          >
            Refresh
          </button>
        </div>
      {files?.length > 0 ?
        <div className="relative overflow-x-auto delivery-files-main-container">
            <table className="w-full text-sm table-fixed text-left text-gray-500">
                <thead className="text-sm text-gray-700 bg-gray-200 ">
                    <tr>
                        <th scope="col" className="px-4 py-2 w-16">
                            Albar&aacute;n
                        </th>
                        <th scope="col" className="px-2 py-2 w-20">
                            Descripci&oacute;n
                        </th>
                        <th scope="col" className="px-4 py-2 w-8">
                            Inc.
                        </th>
                        <th scope="col" className="px-4 py-2 w-8">
                            Rev.
                        </th>
                        {employee.admin 
                          ? <th scope="col" className="px-4 py-2 w-6">
                              Visib.
                            </th>
                          : ""} 
                        <th scope="col" className="px-2 py-2 w-6">
                            Eliminar
                        </th>
                    </tr>
                </thead>
                <tbody>
                {files?.map((item, index) => (
                  <tr className="bg-white border-b text-gray-900" key={item+"-"+index}>
                    <th scope="row" className="px-2 py-4 w-16 font-bold whitespace-nowrap">
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
                    <td className="px-4 py-2 w-8">
                      {item.incidents ? <AlertTriangleIcon/> : ""}
                    </td>
                    <td className="px-4 py-2 w-8">
                      {item.completed ? <FileCheckIcon/> : ""}
                    </td>
                    {employee.admin 
                        ? <td className="px-4 py-2 w-6">
                          {item.visible 
                            ? <button onClick={() => (
                                updateFile(item.number, item.incidents, item.completed, false), 
                                handleListAllFiles(showVisibleFiles)
                              )}>
                                <EyeOpenIcon /> 
                              </button>
                            : <button onClick={() => (
                                updateFile(item.number, item.incidents, item.completed, true),
                                handleListAllFiles(showVisibleFiles)
                              )}>
                                <EyeOffIcon /> 
                              </button>
                          }
                        </td>
                          : ""} 
                    <td className="px-4 py-2 w-6">
                      {employee.admin ? 
                        <button 
                          type="button" 
                          className="delete-table-button"
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