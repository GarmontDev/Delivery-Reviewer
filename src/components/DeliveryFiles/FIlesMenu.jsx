import "./FilesMenu.css"
import { useNavigate } from "react-router-dom";
import { listAllFiles, updateIncidents } from "../../config/firebase.js";
import secureLocalStorage from "react-secure-storage";
import { slide as Menu } from 'react-burger-menu';
import { useState } from "react";
import MenuIcon from "../../assets/icons/MenuIcon.jsx"
import XClearIcon from "../../assets/icons/XClearIcon.jsx";

const FilesMenu = ({employee, setEmployee, showVisibleFiles, setShowVisibleFiles}) => { 
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false)

  function refreshFilesState(){
    listAllFiles(showVisibleFiles)
    .then((res) => {
      if(res){
        res.forEach(element => {
          updateIncidents(element.number)
        });
      }
      alert("Files updated")
      setMenuOpen(false)
    })
  }

  return(
    <>
      <div className="">
        <Menu isOpen={menuOpen}
          customBurgerIcon={<MenuIcon size={30}/>}
          customCrossIcon={<XClearIcon stroke="white"/>}
          right
          className="w-10 h-10"
          menuClassName="bg-slate-800 rounded-tl-lg pt-2 pl-2"
          itemClassName="text-white tracking-wider ml-4 mt-4"
          crossButtonClassName="mr-2 mt-4 bg-red-400 rounded-sm"
          burgerButtonClassName="size-10"
          burgerBarClassName="w-10 h-10"
        >
          <a id="barcode-search" className="menu-item" href="/barcodesearch">Consultar c&oacute;digo</a>
          {employee 
            ? <a id="create-temporary-file" className="menu-item" href="/createtemporaryfile">Entrada temporal</a>
            : "" 
          }
          
          {employee.admin 
            ? <button id="update-incidents" className="menu-item" onClick={() => refreshFilesState()}>Actualizar incidencias</button>
            : ""
          }
          {employee.admin 
            ? <a id="create-new-file" className="menu-item" href="/createfile">Subir albarán</a>
            : ""
          }
        </Menu>
      </div>
    </>
  )
 }

 export default FilesMenu