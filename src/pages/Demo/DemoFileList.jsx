import { useEffect, useState } from "react";
import VisibleFilesOptionBtn from "../../components/DeliveryFiles/VisibleFilesOptionBtn";
import CustomDatePicker from "../../components/CustomDatePicker/CustomDatePicker";
import DemoFileListTable from "./DemoFileListTable";
import Swal from "sweetalert2";

const DemoFileList = ({ employee, showVisibleFiles, setShowVisibleFiles }) => {
  const [datePicked, setDatePicked] = useState([
    new Date(new Date() - 7 * 86400000),
    new Date(),
  ]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [demoFiles, setDemoFiles] = useState([
    {
      "number": "34506129",
      "description": "Pedido camión",
      "incidentscounter": 4,
      "visible": true,
      "completed": true,
      "state": 2,
      "incidents": true,
      "createdDate": { //TODO set today date and the others <> 1 and <> 2 days
        "seconds": 1736722800,
        "nanoseconds": 0
      }
    },
    {
      "state": 1,
      "number": "34508722",
      "visible": true,
      "incidents": true,
      "completed": true,
      "createdDate": {
        "seconds": 1736841516,
        "nanoseconds": 877000000
      },
      "description": "Baza",
      "incidentscounter": 1
    },
    {
      "description": "Granada",
      "createdDate": {
        "seconds": 1736809200,
        "nanoseconds": 0
      },
      "incidents": false,
      "completed": true,
      "visible": true,
      "number": "34515662",
      "state": 0
    },
    {
      "number": "34523730",
      "createdDate": {
        "seconds": 1737028612,
        "nanoseconds": 305000000
      },
      "incidents": false,
      "visible": true,
      "completed": false,
      "description": "Pedido jueves"
    },
    {
      "number": "34523730",
      "createdDate": {
        "seconds": 1737028612,
        "nanoseconds": 305000000
      },
      "incidents": false,
      "visible": false,
      "completed": false,
      "description": "Granada inactivo"
    },
    {
      "number": "43243243",
      "createdDate": {
        "seconds": 1736722800,
        "nanoseconds": 305000000
      },
      "incidents": false,
      "visible": false,
      "completed": false,
      "description": "Baza inactivo 2"
    },
    {
      "number": "43243243",
      "createdDate": {
        "seconds": 1736841516,
        "nanoseconds": 305000000
      },
      "incidents": false,
      "visible": false,
      "completed": false,
      "description": "Pedido camión"
    }
  ])

  const [filteredFiles, setFilteredFiles] = useState(demoFiles);

  useEffect(() => {
    if (!calendarOpen) {
      filterFilesByDate(showVisibleFiles);
    }
  }, [calendarOpen]);

  useEffect(() => {
    if (showVisibleFiles) {
      fetchMockedFiles(true);
    } else {
      fetchMockedFiles(false);
    }
  }, [showVisibleFiles, demoFiles]);

  function updateFile(fileNumber, fileIncidents, fileCompleted, fileVisible){
    setDemoFiles(
      demoFiles.map((file) => {
        if (file.number === fileNumber) {
          return {...file, incidents: fileIncidents, completed: fileCompleted, visible: fileVisible};
        } else {
          return file;
        }
      })
    )  
  }

  function fetchMockedFiles(isVisible) {
    setFilteredFiles(demoFiles.filter(file => file.visible === isVisible));
  }

  function filterFilesByDate() {
    setFilteredFiles(demoFiles);
  }

  function filterFilesByNumber(value) {
    setFilteredFiles(demoFiles.filter((file) => file.number.includes(value)));
  }

  function filterFilesByDescription(value) {
    setFilteredFiles(
      demoFiles.filter((file) =>
        file.description.toUpperCase().includes(value.toUpperCase())
      )
    );
  }

  function handleDeleteFile(fileNumber) {
    setFilteredFiles(
      filteredFiles.filter((file) =>
        (file.number !== fileNumber) 
      )
    )
    Swal.fire({
      title: "Albarán eliminado con éxito",
      icon: "success",
      position: "top",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Aceptar",
    });
  }

  function handleDeliveryFile(number, createdDate, completed, incidents) {
    alert('Working on it')
  }

  return (
    <>
      {employee.admin ? (
        <VisibleFilesOptionBtn
          showVisibleFiles={showVisibleFiles}
          setShowVisibleFiles={setShowVisibleFiles}
        />
      ) : (
        ""
      )}
      {!showVisibleFiles ? (
        <div className="grid grid-cols-1 grid-rows-3 h-40">
          <div className="w-full">
            <div id="inactive-files-date" className="flex">
              <span className="p-1 pr-2 mt-3 ml-1">Fecha</span>
              <div className="mt-2 w-full h-auto ">
                {calendarOpen ? (
                  <CustomDatePicker
                    calendarOpen={calendarOpen}
                    setCalendarOpen={setCalendarOpen}
                    datePicked={datePicked}
                    setDatePicked={setDatePicked}
                    isRange={true}
                  />
                ) : (
                  <button
                    className="text-input"
                    onClick={() => setCalendarOpen(true)}
                  >
                    {datePicked[0].toLocaleDateString()} hasta{" "}
                    {datePicked[1].toLocaleDateString()}
                  </button>
                )}
              </div>
            </div>
            <div id="inactive-files-description" className="flex">
              <span className="p-1 pr-2 mt-3 ml-1 w-full">Descripción</span>
              <input
                className="text-gray-800 rounded-lg border-2 shadow pl-2 h-10 mt-2 w-auto focus:outline-blue-700 col-span-3"
                placeholder="Pedido"
                onChange={(e) => filterFilesByDescription(e.target.value)}
              />
            </div>
            <div id="inactive-files-number" className="flex">
              <span className="p-1 pr-2 mt-3 ml-1 w-full">N&uacute;mero</span>
              <input
                className="text-gray-800 rounded-lg border-2 shadow pl-2 h-10 mt-2 w-auto focus:outline-blue-700 col-span-3"
                placeholder="Albar&aacute;n"
                onChange={(e) => filterFilesByNumber(e.target.value)}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <DemoFileListTable
        employee={employee}
        filteredFiles={filteredFiles}
        showVisibleFiles={showVisibleFiles}
        updateFile={updateFile}
        handleDeliveryFile={handleDeliveryFile}
        handleDeleteFile={handleDeleteFile}
      />
    </>
  );
};

export default DemoFileList;
