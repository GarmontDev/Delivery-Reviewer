import "./DeliveryFiles.css"
import { useState } from "react";
import FilesList from "./FilesList.jsx";
import FilesMenu from "./FIlesMenu.jsx";

const DeliveryFiles = ({employee, setEmployee}) => { 

  const [showVisibleFiles, setShowVisibleFiles] = useState(true)
  
  return(
    <> 
      <FilesMenu employee={employee} setEmployee={setEmployee} showVisibleFiles={showVisibleFiles} setShowVisibleFiles={setShowVisibleFiles}/>
      <FilesList employee={employee} showVisibleFiles={showVisibleFiles}/>
    </>
  )
 }

 export default DeliveryFiles;