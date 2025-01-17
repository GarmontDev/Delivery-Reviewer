import { useEmployeeContext } from "../../context/EmployeeContext";
import { useEffect, useState } from "react";
import EmployeeSelection from "../../components/EmployeeSelection/EmployeeSelection";
import FilesList from "../../components/DeliveryFiles/List/FilesList";
import Footer from "../../components/Footer";
import DRlogo from "../../assets/images/DR_Logo_Transp.webp";
import MenuIcon from "../../assets/icons/MenuIcon";
import DemoFileList from "./DemoFIleList";

const DemoPage = () => {
  const { employee, setEmployee } = useEmployeeContext();
  const [showVisibleFiles, setShowVisibleFiles] = useState(true);

  useEffect(() => {
    setEmployee({ name: "Demo", admin: true });
  }, []);

  const demoOnlyMessage =
    "Only this page is available as a demo, hope you enjoy it!";

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
              onClick={() => alert(demoOnlyMessage)}
            >
              {employee.name}
            </button>
          </div>
        ) : (
          ""
        )}
        <button
          className="absolute right-2 top-2 hover:bg-gray-300 p-1 rounded-md"
          onClick={() => alert(demoOnlyMessage)}
        >
          <MenuIcon size={30} />
        </button>
      </div>
      <div className="home-container">
        {employee ? (
          <DemoFileList
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
};

export default DemoPage;
