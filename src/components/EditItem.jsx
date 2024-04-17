import { useContext, useEffect, useRef, useState } from "react"
import { updateItem } from "../config/firebase"
import { useEmployeeContext } from "../context/EmployeeContext"

const EditItem = ({item, setItemSelected, fileNumber, setOpenEditItem}) => { 

  const [units, setUnits] = useState(item.unitsReceived)
  const [newCheck, setNewCheck] = useState(item.checked)

  const {employee} = useEmployeeContext()

  const handleChange = (e) => {
    e.preventDefault()
    setUnits(Number(e.target.value))
    
    if(item.unitsBilled === Number(e.target.value)){
      setNewCheck(true)
    }else{
      setNewCheck(false)
    }
  }

  function handleEditting (item){
    const incidents = (item.unitsBilled != units)
    updateItem(item, units, newCheck, incidents, fileNumber, employee.name)
      .then((res) => {
        if(res){
          setItemSelected({ ...item, 
            unitsReceived: units,
            checked: newCheck, 
            incidents: incidents, 
            checkedby: employee.name
          })
          // setFilteredData(res)
          setOpenEditItem(false)
        }
      }
    )
  }

  return(
    <>
      <div className="bg-white rounded-md p-6 text-base leading-relaxed text-gray-600">
        <div className="grid grid-rows-2 font-bold">
          <h1 className="text-2xl">{item.code}</h1>
          <h2 className="text-xl text-center border-2 ml-6 mr-6 p-2 -mt-4 rounded-md">{item.description}</h2>
          
        </div>
        <div className="grid grid-cols-2 px-10 text-center justify-center items-center">
          <div className="">
            Cantidad anterior: 
            <div className="text-2xl font-semibold">
              {item.unitsReceived}
            </div>
          </div>
          <div className="pt-4 grid grid-cols-1 place-items-center">
            Reemplazar: 
            <input
              type="number" 
              inputMode="numeric"
              id="unitsReceivedInput" 
              value={units}
              autoFocus
              onChange={handleChange}
              onFocus={e => e.target.select()}
              className="w-28 h-16 text-center text-xl rounded-md border-2 border-gray-200" 
            />
          </div>
        </div>
        <div className="flex items-center justify-between p-4 border-t mt-2 border-gray-200 rounded-b">
          <button 
            type="button" 
            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700"
            onClick={() => setOpenEditItem(false)}
          >
            Cancelar
          </button>
          <button 
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={() => (handleEditting(item))}
          >
            Aceptar
          </button>
        </div>
      </div>
    </>
  )
 }

 export default EditItem