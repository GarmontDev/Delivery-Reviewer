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
import ControlPanel from "../ControlPanel/ControlPanel.jsx";

const DeliveryFiles = ({employee, setEmployee}) => { 

  const navigate = useNavigate();

  const [files , setFiles] = useState([])
  const [filteredFiles, setFilteredFiles] = useState(null)
  const [showVisibleFiles, setShowVisibleFiles] = useState(true)
  const [controlPanelActive, setControlPanelActive] = useState(false)
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
          {employee.admin && !controlPanelActive
            ? !showVisibleFiles
                ? <button className="rounded-md bg-blue-700 text-white text-sm pl-2 pr-2 h-6 mt-1"
                    onClick={() => (handleListAllFiles(true), setShowVisibleFiles(true))}
                  >
                    Visibles
                  </button>
                : <button className="rounded-md bg-blue-700 text-white text-sm pl-2 pr-2 h-6 mt-1"
                    onClick={() => (handleListAllFiles(false), setShowVisibleFiles(false))}
                  >
                    Ocultos
                  </button>
            : ""
          }
          {!controlPanelActive && employee.admin ?
            <button 
              className="bg-blue-500 text-white text-sm rounded-md pl-2 pr-2 h-6 mt-1 "
              onClick={() => {refreshFilesState()}}
            >
              Refresc.
            </button>
          : ""  
          }
          {employee.admin ?
            <button className="rounded-md bg-blue-800 text-white text-sm pl-2 pr-2 h-6 mt-1 mr-4"
              onClick={() => setControlPanelActive(!controlPanelActive)}
            >
              Admin
            </button>
            : ""
          }

        </div>
      {files?.length > 0 && !controlPanelActive?
        <div className="delivery-files-items-container">
            {files?.map((item, index) => (
              <div 
                className="grid grid-cols-2 grid-rows-2 bg-white border-2 rounded-lg m-2 w-full h-14 text-gray-900" 
                key={item+"-"+index}
              >
                <button className="grid grid-rows-2 grid-cols-1 ml-2 hover:text-green-800"
                  onClick={() => handleDeliveryFile(item.number)}
                >
                  <div 
                    id={item} 
                    className="font-semibold flex justify-start pl-1 pt-1"
                  >
                    {item.number}
                  </div>
                  <div className="w-44 py-2 px-1 flex">
                    {item.description}
                  </div>
                </button>  
                <div className="grid grid-rows-1 grid-cols-4 pt-4">
                  <div className="w-8">
                    {item.incidents ? <AlertTriangleIcon/> : ""}
                  </div>
                  <div className="w-8">
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
                  </div>
                  {employee.admin 
                      ? <div className="w-6">
                        {item.visible 
                          ? <button onClick={() => (
                              updateFile(item.number, item.incidents, item.completed, false), 
                              handleListAllFiles(showVisibleFiles)
                            )}>
                              <EyeOpenIcon /> 
                            </button>
                          : <button onClick={() => (
                              updateFile(item.number, item.incidents, item.completed, divue),
                              handleListAllFiles(showVisibleFiles)
                            )}>
                              <EyeOffIcon /> 
                            </button>
                        }
                      </div>
                        : ""} 
                  <div className="w-6">
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
                  </div>
                </div>
            </div>
            ))}
        </div>
      : !controlPanelActive ? 
          <div className="no-files-available">
            No hay albaranes disponibles
          </div> 
        : ""
      }
      {controlPanelActive ? <ControlPanel/> : ""}
    </>
  )
 }

 export default DeliveryFiles;