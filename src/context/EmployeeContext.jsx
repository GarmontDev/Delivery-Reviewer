import { useState, createContext, useContext } from "react";

const EmployeeContext = createContext()

export default function EmployeeContextProvider({children}) {
  const [employee, setEmployee] = useState("");

  return (
    <EmployeeContext.Provider value={{ employee, setEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => useContext(EmployeeContext);