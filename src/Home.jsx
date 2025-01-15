import "./index.css";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./context/UserContext";
import { useEffect, useState } from "react";
import EmployeeSelection from "./components/EmployeeSelection/EmployeeSelection";
import { useEmployeeContext } from "./context/EmployeeContext";
import secureLocalStorage from "react-secure-storage";
import FilesMenu from "./components/DeliveryFiles/Menu/FilesMenu";
import FilesList from "./components/DeliveryFiles/List/FilesList";
import Footer from "./components/Footer";

function Home() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { employee, setEmployee } = useEmployeeContext();
  const [showVisibleFiles, setShowVisibleFiles] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    setEmployee(JSON.parse(secureLocalStorage.getItem("employee")) || "");
  }, []);

  function handleEmployeeButton() {
    secureLocalStorage.removeItem("employee");
    setEmployee("");
    navigate("/home");
  }

  return (
    <>
        <div className="header-container">
          <div className="header-icon">
            {/* <FaviconIcon size={32} /> */}
            <img src="src\assets\images\DR_Logo_Transp.webp"/>
            Delivery Reviewer
          </div>
          {employee ? (
            <div className="pl-2 pb-2 flex items-center">
              <button
                id="user-name"
                className="employee-name-button"
                onClick={() => handleEmployeeButton()}
              >
                {employee.name}
              </button>
            </div>
          ) : (
            ""
          )}
          <div className="absolute right-0 top-3">
            <FilesMenu
              employee={employee}
              setEmployee={setEmployee}
              showVisibleFiles={showVisibleFiles}
              setShowVisibleFiles={setShowVisibleFiles}
            />
          </div>
        </div>
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
