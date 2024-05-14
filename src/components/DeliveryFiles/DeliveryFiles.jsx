import "./DeliveryFiles.css"
import SearchIcon from "../../assets/icons/SearchIcon.jsx"
import { useState } from "react";
import FilesList from "./FilesList.jsx";
import FilesMenu from "./FIlesMenu.jsx";

const DeliveryFiles = ({employee, setEmployee}) => { 

  const [showVisibleFiles, setShowVisibleFiles] = useState(true)
  
  return(
    <> 
      <FilesMenu employee={employee} setEmployee={setEmployee} showVisibleFiles={showVisibleFiles} setShowVisibleFiles={setShowVisibleFiles}/>
      {!showVisibleFiles ? 
        <div className="flex">
          <span className="p-1 pr-2 mt-3 ml-1">
            <SearchIcon/>
          </span>
          <input 
            className="text-gray-800 rounded-lg border-2 shadow pt-1 pb-1 pl-4 h-10 mt-2 w-full focus:outline-blue-700"
            placeholder="Número de albarán"
          />
        </div>
      : ""}

      <FilesList employee={employee} showVisibleFiles={showVisibleFiles}/>
    </>
  )
 }

 export default DeliveryFiles;