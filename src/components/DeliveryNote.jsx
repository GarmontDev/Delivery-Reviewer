import CheckIcon from "../assets/icons/CheckIcon";
import CheckBoxEmpty from "../assets/icons/CheckBoxEmpty"
import { updateItem } from "../config/firebase";
import { useEffect, useState } from "react";

const DeliveryNote = ({ data, setData, reviewFileNumber }) => { 

  useEffect(() => {
    setLines(data)
  }, [data])
  
  
  const [lines, setLines] = useState(data) 

  function updateLine(item, newCheck){
    updateItem(item, newCheck, reviewFileNumber)
      .then((res) => {
        if(res){
          setLines(res)
          setData(res)
        }
      })
  }

  return(
    <>
      <div className="grid grid-cols-1 text-slate-800 pt-2 text-sm w-auto">
        <table className="min-w-full text-left font-light text-surface dark:text-white">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="px-2 py-1 w-4">
                Check
              </th>
              <th className="px-2 w-4">
                Units
              </th>
              <th className="px-2 w-2">
                Code
              </th>
              <th className="px-4 min-w-full">
                Description
              </th>
              <th className="px-2 overflow-scroll">
                Barcode
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            {lines?.map((item, index) => (
              <tr key={index} className={`border-gray-400 rounded-md ${item?.checked ? "bg-green-200" : ""}`}>  
                <td className="px-2">
                  <button className="p-3" onClick={() => updateLine(item, !item.checked)}>
                    {item?.checked
                      ? <CheckIcon size={20}/>
                      : <CheckBoxEmpty size={20}/>
                    }
                  </button>
                </td>          
                <td scope="col" className="px-4">
                  {item.units}
                </td>
                <td className="">
                  {item.code} 
                </td>
                <td className="px-2">
                  {item.description}
                </td>
                <td className="">
                  {item.barcode}
                </td>
              </tr>          
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
 }

 export default DeliveryNote;