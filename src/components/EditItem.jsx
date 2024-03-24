import { useState } from "react"
import { updateItem } from "../config/firebase"

const EditItem = ({item, fileNumber, setOpenEditItem, setData, setFilteredData}) => { 

  const [units, setUnits] = useState(item.unitsReceived)
  const [newCheck, setNewCheck] = useState(item.checked)

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
    updateItem(item, units, newCheck, fileNumber)
    .then((res) => {
      if(res){
        setData(res)
        setFilteredData(res)
      }
    })
    setOpenEditItem(false)
  }

  return(
    <>
      <div className="bg-white rounded-md p-6 text-base leading-relaxed text-gray-600">
        <section className="flex gap-4">
          <h1 className="font-bold text-lg">{item.code}</h1>
          <h2 className="font-bold text-base">{item.description}</h2>
        </section>
        <div className="flex gap-4 text-center items-center mt-6 mx-12">
          <div>Unidades recibidas:</div>
          <input 
            type="text" 
            id="unitsReceivedInput" 
            value={units} 
            onChange={handleChange}
            className="w-24 text-center rounded-md border-2 border-gray-200" 
            autoFocus 
            placeholder="0"
          />
        </div>
        <div className="flex items-center justify-between p-4 border-t mt-2 border-gray-200 rounded-b">
          <button 
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={() => (handleEditting(item))}
          >
            Aceptar
          </button>
          <button 
            type="button" 
            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700"
            onClick={() => setOpenEditItem(false)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  )
 }

 export default EditItem