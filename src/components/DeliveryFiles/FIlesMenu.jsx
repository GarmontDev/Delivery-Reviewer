import "./FilesMenu.css"
import { useNavigate } from "react-router-dom";
import { listAllFiles, updateIncidents } from "../../config/firebase";
import secureLocalStorage from "react-secure-storage";

const FilesMenu = ({employee, setEmployee, showVisibleFiles, setShowVisibleFiles}) => { 
  const navigate = useNavigate();

  function handleEmployeeButton(){
    secureLocalStorage.removeItem("employee")
    setEmployee("")
    navigate("/home")
  }

  function refreshFilesState(){
    listAllFiles(showVisibleFiles)
    .then((res) => {
      if(res){
        res.forEach(element => {
          updateIncidents(element.number)
        });
      }
    })
  }

  return(
    <>
      <div className="delivery-files-container">
        <button className="user-name" onClick={() => (handleEmployeeButton())}>
          {employee ? employee.name : "No user selected"}
        </button>
          {employee.admin
            ? !showVisibleFiles
              ? <button className="menu-visible-button"
                  onClick={() => (setShowVisibleFiles(true))}
                >
                  Visibles
                </button>
              : <button className="menu-visible-button"
                  onClick={() => (setShowVisibleFiles(false))}
                >
                  Ocultos
                </button>
            : ""
          }
          {employee.admin ?
            <button 
              className="menu-update-files-button "
              onClick={() => {refreshFilesState()}}
            >
              Actualizar
            </button>
          : ""  
          }
          {employee.admin ?
            <button className="menu-admin-button"
              onClick={() => navigate("/createfile")}
            >
              Admin
            </button>
            : ""
          }
      </div>
    </>
  )
 }

 export default FilesMenu