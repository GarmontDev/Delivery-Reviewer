import { useEffect, useState } from "react";
import { fetchAllEmployees } from "../../config/firebase";
import EmployeePinForm from "./EmployeePinForm";
import "../../utils/popup-window.css";

const EmployeeSelection = ({ setEmployee }) => {
  const [employeePinModal, setEmployeePinModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeeSelected, setEmployeeSelected] = useState("");

  useEffect(() => {
    fetchAllEmployees().then((res) => {
      if (res) {
        setEmployees(res);
      }
    });
  }, []);

  function handleEmployeeChange(value) {
    setEmployeeSelected(value);
    setEmployeePinModal(true);
  }

  return (
    <>
      <div className="grid grid-cols-2 grid-rows-4 gap-2 mt-10 place-items-center">
        <div className={employeePinModal ? "popup-window bg-white p-4 text-center" : "hidden"}>
          <EmployeePinForm
            employeeSelected={employeeSelected}
            setEmployee={setEmployee}
            setEmployeePinModal={setEmployeePinModal}
          />
        </div>
        {employees.map((employee, index) => (
          <button
            key={employee + index}
            className="flex justify-center bg-white text-blue-700 font-medium w-24 p-2 rounded-md border-2 border-gray-400"
            onClick={() => handleEmployeeChange(employee)}
          >
            {employee.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default EmployeeSelection;
