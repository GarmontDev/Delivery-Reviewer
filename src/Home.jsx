import "./index.css";
import { useNavigate } from "react-router-dom";
import FaviconIcon from "./assets/icons/FaviconIcon";
import { useUserContext } from "./context/UserContext";
import { useEffect, useState } from "react";
import EmployeeSelection from "./components/EmployeeSelection/EmployeeSelection";
import { useEmployeeContext } from "./context/EmployeeContext";
import secureLocalStorage from "react-secure-storage";
import FilesMenu from "./components/DeliveryFiles/Menu/FilesMenu";
import FilesList from "./components/DeliveryFiles/List/FilesList";

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
      <div className="home-container relative">
        <div className="header-container">
          <div className="header-icon">
            <FaviconIcon size={32} />
            Delivery Reviewer
            {employee ? 
              <div className="pl-2 pb-2">
                <button
                  id="user-name"
                  className="menu-visible-button mr-2 ml-10 font-semibold tracking-wider"
                  onClick={() => handleEmployeeButton()}
                >
                  {employee.name}
                </button>
              </div>
            : ""}
          </div>
          <FilesMenu
            employee={employee}
            setEmployee={setEmployee}
            showVisibleFiles={showVisibleFiles}
            setShowVisibleFiles={setShowVisibleFiles}
          />
        </div>
        {employee ? (
          <FilesList
            employee={employee}
            showVisibleFiles={showVisibleFiles}
            setShowVisibleFiles={setShowVisibleFiles}
          />
        ) : (
          <EmployeeSelection setEmployee={setEmployee} />
        )}
        {/* <Footer/> */}
      </div>
    </>
  );
}

export default Home;
