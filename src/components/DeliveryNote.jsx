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
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full table-fixed text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-2 py-1 w-12">
                Check
              </th>
              <th className="px-2 w-14">
                Code
              </th>
              <th className="px-2 w-10">
                Units
              </th>
              <th className="px-4 w-screen">
                Description
              </th>
              <th className="px-2">
                Barcode
              </th>
            </tr>
          </thead>
          <tbody className="odd:bg-white even:bg-gray-50 border-b">
            {lines?.map((item, index) => (
              <tr key={index} className={`${item?.checked ? "bg-green-200" : "odd:bg-white even:bg-gray-100 "}`}>  
                <td className="px-2">
                  <button className="p-3" onClick={() => updateLine(item, !item.checked)}>
                    {item?.checked
                      ? <CheckIcon size={20}/>
                      : <CheckBoxEmpty size={20}/>
                    }
                  </button>
                </td>          
                <td className="px-2">
                  {item.code} 
                </td>
                <td scope="col" className="px-4">
                  {item.units}
                </td>
                <th className="px-2 py-2">
                  {item.description}
                </th>
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