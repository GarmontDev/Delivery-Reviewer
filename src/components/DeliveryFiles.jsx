import { useEffect, useState } from "react";
import { ListAllFiles } from "../config/firebase";

const DeliveryFiles = ({setReviewFileNumber}) => { 

  const [files , setFiles] = useState([])

  useEffect(() => {
    ListAllFiles()
    .then((res) => {
      if(res){
        setFiles(res)
      }
    })
  }, [])
  
  return(
    <>
      <div className="pl-4 border-2 border-gray-400 rounded-b-sm">
        {files.length > 0 ? <div>Albaranes disponibles: {files.length}</div> : ""}
        {files.map((item, index) => (
          <button 
            id={item} 
            key={item+"-"+index}
            className="rounded-md border-1 font-bold mr-8 hover:text-green-800"
            onClick={() => setReviewFileNumber(item.toString())}
          >
            {item}
          </button>
        ))}
      </div>
    </>
  )
 }

 export default DeliveryFiles;