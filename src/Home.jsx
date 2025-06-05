import "./index.css";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./context/UserContext";
import { useEffect, useState } from "react";
import EmployeeSelection from "./components/EmployeeSelection/EmployeeSelection";
import secureLocalStorage from "react-secure-storage";
import FilesMenu from "./components/DeliveryFiles/Menu/FilesMenu";
import FilesList from "./components/DeliveryFiles/List/FilesList";
import UploadIcon from "/src/assets/icons/UploadIcon.jsx";
import Footer from "./components/Footer";
import DRlogo from "./assets/images/DR_Logo_Transp.webp";
import EmployeeIdle from "./components/EmployeeIdle/EmployeeIdle";
import { useEmployeeContext } from "./context/EmployeeContext";
import { ToastContainer } from "react-toastify";

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
      <div className="bg-gray-100 min-h-screen w-full flex flex-col items-center">
        <div
          id="header"
          className="bg-white flex items-center w-full max-w-3xl h-14 p-3 mb-3 border-b-2 shadow-lg border-gray-300 rounded-b-lg"
        >
          <div className="w-full col-span-3 flex whitespace-nowrap gap-2 text-lg text-sky-600 font-semibold ">
            <img src={DRlogo} className="size-8" />
            Delivery Reviewer
          </div>
          <button className="relative flex items-center content-center justify-center mr-4 hover:bg-blue-700 hover:text-white rounded-md p-1" onClick={() => navigate("/upload")}>
            <UploadIcon />
          </button>
          <div className="relative flex items-center content-center justify-center mr-4">
            {employee && (
              <button
                id="user-name"
                className="rounded-md px-2 bg-blue-700 hover:bg-blue-500 text-white text-sm flex h-8 place-items-center font-semibold tracking-wider"
                onClick={() => (clearEmployeeContext(), navigate("/home"))}
              >
                {employee.name}
              </button>
            )}
          </div>
          <div className="relative flex items-center content-center justify-center">
            <FilesMenu />
          </div>
        </div>
        {employee ? <EmployeeIdle /> : ""}
        <div className="pl-2 pr-2">
          {employee ? (
            <FilesList
              showVisibleFiles={showVisibleFiles}
              setShowVisibleFiles={setShowVisibleFiles}
            />
          ) : (
            <EmployeeSelection setEmployee={setEmployee} />
          )}
        </div>
        <Footer />
        <ToastContainer limit={4} />
      </div>
    </>
  );
}

export default Home;
