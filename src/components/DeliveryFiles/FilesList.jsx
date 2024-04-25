import AlertTriangleIcon from "../../assets/icons/AlertTriangleIcon.jsx"
import { EyeOpenIcon } from "../../assets/icons/EyeIcon.jsx";
import { EyeOffIcon } from "../../assets/icons/EyeIcon.jsx";
import CheckIcon from "../../assets/icons/CheckIcon.jsx";
import EmptyCheckIcon from "../../assets/icons/EmptyCheckIcon.jsx"
import { deleteFile, deleteFileFromCollections, listAllFiles, updateCompleted, updateFile, updateIncidents } from "../../config/firebase.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryFiles.css"

const FilesList = ({employee, showVisibleFiles}) => { 
  const navigate = useNavigate();

  const [files , setFiles] = useState([])

  useEffect(() => {
    handleListAllFiles(showVisibleFiles)
  }, [showVisibleFiles])

  function handleListAllFiles(visible){
    listAllFiles(visible)
    .then((res) => {
      if(res){
        setFiles(res)
      }
    })
  }

  function handleDeliveryFile(value){
    navigate("/notes", {state: {reviewFileNumber: value.toString()}})
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
    {files?.length > 0
      ? <div className="delivery-files-items-container">
          {files?.map((item, index) => (
            <div 
              className="grid grid-cols-2 grid-rows-2
              bg-white border-2 rounded-lg m-2 w-full h-14 text-gray-900" 
              key={item+"-"+index}
            >
              <button className="grid grid-rows-2 grid-cols-1 ml-2 hover:text-blue-600"
                onClick={() => handleDeliveryFile(item.number)}
                >
                <div 
                  id={item} 
                  className="font-semibold flex justify-start pl-1 pt-1"
                  >
                  {item.number}
                  <p className="ml-2 font-medium">
                    {typeof(item.createdDate) === "string" ? item.createdDate : 
                      new Date(item.createdDate.seconds*1000).toLocaleDateString()
                    }
                  </p>
                </div>
                <div className="w-44 py-2.5 px-1 flex text-blue-700">
                  {item.description}
                </div>
              </button>  
              <div className="grid grid-rows-1 grid-cols-4 pt-4 ml-2">
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
                          updateFile(item.number, item.incidents, item.completed, true),
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
        : <div className="no-files-available">
            No hay albaranes disponibles
          </div>
    }
        </>
  )
 }

 export default FilesList