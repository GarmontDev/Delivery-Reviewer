import { useContext, useEffect, useState } from "react"
import { fetchAllEmployees } from "../../config/firebase"
import Popup from "reactjs-popup"
import EmployeePinForm from "./EmployeePinForm"

const EmployeeSelection = ({setEmployee}) => { 

  const [employeePinModal, setEmployeePinModal] = useState(false)
  const [employees, setEmployees] = useState([])
  const [employeeSelected, setEmployeeSelected] = useState("")

  useEffect(() => {
    fetchAllEmployees()
    .then((res) => {
      if(res){setEmployees(res)}
    }) 
  }, [])

  function handleEmployeeChange(value){
    setEmployeeSelected(value)
    if(employeeSelected.name === value.name){
      setEmployeePinModal(true)
    }
  }

  return(
    <>
      <div className="grid grid-cols-2 grid-rows-4 gap-2 mt-10 place-items-center">
        <Popup 
          modal
          nested
          open={employeePinModal} 
          onClose={() => (setEmployeePinModal(false))} 
          repositionOnResize
          position="top center"
          >    
          <EmployeePinForm employeeSelected={employeeSelected} setEmployee={setEmployee}/>
        </Popup>
        {employees.map((employee, index) => (
          <button 
            key={employee+index} 
            className="bg-gray-200 text-blue-700 font-medium w-24 p-2 rounded-md border-2 border-gray-400"
            onClick={() => handleEmployeeChange(employee)}
          >
            {employee.name}
          </button>
        ))}
      </div>
    </>
  )
 }

 export default EmployeeSelection