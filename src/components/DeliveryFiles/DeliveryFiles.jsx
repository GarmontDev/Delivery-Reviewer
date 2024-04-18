import "./DeliveryFiles.css"
import { useEffect, useState } from "react";
import { deleteFile, deleteFileFromCollections, listAllFiles, updateFile, updateIncidents, updateCompleted} from "../../config/firebase.js";
import { useNavigate } from "react-router-dom";
import AlertTriangleIcon from "../../assets/icons/AlertTriangleIcon.jsx"
import { EyeOpenIcon } from "../../assets/icons/EyeIcon.jsx";
import { EyeOffIcon } from "../../assets/icons/EyeIcon.jsx";
import secureLocalStorage from "react-secure-storage";
import CheckIcon from "../../assets/icons/CheckIcon.jsx";
import EmptyCheckIcon from "../../assets/icons/EmptyCheckIcon.jsx"

const DeliveryFiles = ({employee, setEmployee}) => { 

  const navigate = useNavigate();

  const [files , setFiles] = useState([])
  const [filteredFiles, setFilteredFiles] = useState(null)
  const [showVisibleFiles, setShowVisibleFiles] = useState(true)

  useEffect(() => {
    handleListAllFiles(true)
  }, [])

  function refreshFilesState(){
    listAllFiles(showVisibleFiles)
    .then((res) => {
      if(res){
        res.forEach(element => {
          updateIncidents(element.number)
        });
        setFiles(res)
      }
    })
  }

  function handleListAllFiles(visible){
    listAllFiles(visible)
    .then((res) => {
      if(res){
        setFiles(res)
      }
    })
  }

  function handleUpdateCompleted(number, completed){
    updateCompleted(number, completed)
    .then((res) => {
      if(res){
        setFiles(files.map((file) => {
          if(file.number === number){
            return {...file, completed: !completed}
          }else{
            return file
          }
        }))

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

  function handleEmployeeButton(){
    secureLocalStorage.removeItem("employee")
    setEmployee("")
    navigate("/home")
  }
  
  return(
    <> 
        <div className="delivery-files-container">
          <button className="user-name" onClick={() => (handleEmployeeButton())}>
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
            onClick={() => {refreshFilesState()}}
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
                        <th scope="col" className="px-2 py-2 w-16">
                            Descripc.
                        </th>
                        <th scope="col" className="px-4 py-2 w-8">
                            Inc.
                        </th>
                        <th scope="col" className="px-4 py-2 w-8">
                            Comp.
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
                    <td className="px-4 py-2 w-16">
                      {item.description}
                    </td>
                    <td className="px-4 py-2 w-8">
                      {item.incidents ? <AlertTriangleIcon/> : ""}
                    </td>
                    <td className="px-4 py-2 w-8">
                      {item.completed ? 
                        <button 
                          disabled={!employee.admin} 
                          className="disabled:cursor-not-allowed"
                          onClick={() => {handleUpdateCompleted(item.number, item.completed)}}>
                          <CheckIcon size={20}/>
                        </button> 
                        : 
                        <button 
                          disabled={!employee.admin} 
                          className="disabled:cursor-not-allowed"
                          onClick={() => {handleUpdateCompleted(item.number, item.completed)}}>
                          <EmptyCheckIcon size={20}/>
                        </button> 
                      }
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