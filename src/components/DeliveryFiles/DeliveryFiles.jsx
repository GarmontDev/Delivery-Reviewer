import "./DeliveryFiles.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import secureLocalStorage from "react-secure-storage";
import ControlPanel from "../ControlPanel/ControlPanel.jsx";
import FilesList from "./FilesList.jsx";
import { updateIncidents } from "../../config/firebase.js";

const DeliveryFiles = ({employee, setEmployee}) => { 

  const navigate = useNavigate();

  const [showVisibleFiles, setShowVisibleFiles] = useState(true)
  const [controlPanelActive, setControlPanelActive] = useState(false)

  function handleEmployeeButton(){
    secureLocalStorage.removeItem("employee")
    setEmployee("")
    navigate("/home")
  }

  function toggleVisibleFiles(value){
    setShowVisibleFiles(value)
  }

  function refreshFilesState(){
    listAllFiles(showVisibleFiles)
    .then((res) => {
      if(res){
        res.forEach(element => {
          updateIncidents(element.number)
        });
        // setFiles(res)
      }
    })
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
                    onClick={() => (toggleVisibleFiles(true))}
                  >
                    Visibles
                  </button>
                : <button className="rounded-md bg-blue-700 text-white text-sm pl-2 pr-2 h-6 mt-1"
                    onClick={() => (toggleVisibleFiles(false))}
                  >
                    Ocultos
                  </button>
            : ""
          }
          {!controlPanelActive && employee.admin ?
            <button 
              className="bg-red-400 text-white text-sm rounded-md pl-2 pr-2 h-6 mt-1 "
              onClick={() => {refreshFilesState()}}
            >
              Actualizar
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
          <FilesList 
            employee={employee} 
            controlPanelActive={controlPanelActive} 
            showVisibleFiles={showVisibleFiles}
          />
        
      {controlPanelActive ? <ControlPanel/> : ""}
    </>
  )
 }

 export default DeliveryFiles;