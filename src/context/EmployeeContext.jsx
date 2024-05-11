import { useState, createContext, useContext } from "react";
import secureLocalStorage from "react-secure-storage";

const EmployeeContext = createContext()

export default function EmployeeContextProvider({children}) {
  const [employee, setEmployee] = useState(secureLocalStorage.getItem("employee") || "");

  return (
    <EmployeeContext.Provider value={{ employee, setEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => useContext(EmployeeContext);