import "./index.css";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./context/UserContext";
import { useEffect, useState } from "react";
import EmployeeSelection from "./components/EmployeeSelection/EmployeeSelection";
import secureLocalStorage from "react-secure-storage";
import FilesMenu from "./components/DeliveryFiles/Menu/FilesMenu";
import FilesList from "./components/DeliveryFiles/List/FilesList";
import Footer from "./components/Footer";
import DRlogo from "./assets/images/DR_Logo_Transp.webp";
import EmployeeIdle from "./components/EmployeeIdle/EmployeeIdle";
import { useEmployeeContext } from "./context/EmployeeContext";

function Home() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { employee, setEmployee, clearEmployeeContext } = useEmployeeContext();
  const [showVisibleFiles, setShowVisibleFiles] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    setEmployee(JSON.parse(secureLocalStorage.getItem("employee")) || "");
  }, []);

  return (
    <>
      <div className="header-container">
        <div className="header-icon">
          <img src={DRlogo} className="size-8" />
          Delivery Reviewer
        </div>
        {employee ? (
          <div className="pl-2 pb-2 flex items-center">
            <button
              id="user-name"
              className="employee-name-button"
              onClick={() => (clearEmployeeContext(), navigate("/home"))}
            >
              {employee.name}
            </button>
          </div>
        ) : (
          ""
        )}
        <div className="absolute right-0 top-3">
          <FilesMenu setEmployee={setEmployee} />
        </div>
      </div>
      {employee ? <EmployeeIdle /> : ""}
      <div className="home-container">
        {employee ? (
          <FilesList
            employee={employee}
            showVisibleFiles={showVisibleFiles}
            setShowVisibleFiles={setShowVisibleFiles}
          />
        ) : (
          <EmployeeSelection setEmployee={setEmployee} />
        )}
        <Footer />
      </div>
    </>
  );
}

export default Home;
