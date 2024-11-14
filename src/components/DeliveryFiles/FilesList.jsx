import {
  deleteFile,
  deleteFileFromCollections,
  fetchHiddenFilesByDate,
  listAllFiles,
  updateCompleted,
  updateReviewed,
} from "../../config/firebase.js";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryFiles.css";
import CustomDatePicker from "../CustomDatePicker/CustomDatePicker.jsx";
import FilesListTable from "./FilesListTable.jsx";
import VisibleFilesOptionBtn from "./VisibleFilesOptionBtn.jsx";

const FilesList = ({ employee, showVisibleFiles, setShowVisibleFiles }) => {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [datePicked, setDatePicked] = useState([
    new Date(new Date() - 7 * 86400000),
    new Date(),
  ]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (!calendarOpen) {
      filterFilesByDate(showVisibleFiles);
    }
  }, [calendarOpen]);

  useEffect(() => {
    if (showVisibleFiles) {
      handleListAllFiles(showVisibleFiles);
    } else {
      filterFilesByDate(showVisibleFiles);
    }
  }, [showVisibleFiles]);

  function handleListAllFiles(visible) {
    listAllFiles(visible).then((res) => {
      if (res) {
        setFiles(res);
        setFilteredFiles(res);
      }
    });
  }

  function filterFilesByDate(visible) {
    fetchHiddenFilesByDate(visible, datePicked).then((res) => {
      if (res) {
        setFiles(res);
        setFilteredFiles(res);
      }
    });
  }

  function filterFilesByNumber(value) {
    setFilteredFiles(files.filter((file) => file.number.includes(value)));
  }

  function filterFilesByDescription(value) {
    setFilteredFiles(files.filter((file) => file.description.includes(value)));
  }

  function handleDeliveryFile(
    number,
    createdDate,
    completed,
    reviewed,
    incidents
  ) {
    navigate("/notes", {
      state: {
        reviewFileNumber: number.toString(),
        createdDate: createdDate,
        completed: completed,
        reviewed: reviewed,
        incidents: incidents,
      },
    });
  }

  function handleUpdateCompleted(number, completed) {
    updateCompleted(number, completed).then((res) => {
      if (res) {
        setFiles(
          files.map((file) => {
            if (file.number === number) {
              return { ...file, completed: !completed };
            } else {
              return file;
            }
          })
        ),
          setFilteredFiles(files);
      }
    });
  }

  function handleUpdateReviewed(number, reviewed) {
    updateReviewed(number, reviewed).then((res) => {
      if (res) {
        setFiles(
          files.map((file) => {
            if (file.number === number) {
              return { ...file, reviewed: !reviewed };
            } else {
              return file;
            }
          })
        ),
          setFilteredFiles(files);
      }
    });
  }

  function handleDeleteFile(value) {
    deleteFile(value).then((res) => {
      if (res) {
        deleteFileFromCollections(value).then((res) => {
          if (res) {
            handleListAllFiles(showVisibleFiles);
            alert("File deleted successfully");
          } else {
            alert("Error deleting file");
          }
        });
      }
    });
  }

  return (
    <>
      {employee.admin ? (
          <VisibleFilesOptionBtn showVisibleFiles={showVisibleFiles} setShowVisibleFiles={setShowVisibleFiles}/>
      ) : (
        ""
      )}
      {!showVisibleFiles ? (
        <div className="">
          <div className="flex place-content-end">
            <span className="p-1 pr-2 mt-3">Fecha</span>
            <div className="mt-2 w-full">
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
                  className="text-input text-right"
                  onClick={() => setCalendarOpen(true)}
                >
                  {datePicked[0].toLocaleDateString()} hasta{" "}
                  {datePicked[1].toLocaleDateString()}
                </button>
              )}
            </div>
          </div>
          <div className="flex place-content-end">
            <span className="p-1 pr-2 mt-3 ml-1 w-full">Descripción</span>
            <input
              className="text-gray-800 rounded-lg border-2 shadow pl-2 h-10 mt-2 w-full focus:outline-blue-700"
              placeholder="Pedido"
              onChange={(e) => filterFilesByDescription(e.target.value)}
            />
            <span className="p-1 pr-2 mt-3 ml-1 w-full">
              Num. Albar&aacute;n
            </span>
            <input
              className="text-gray-800 rounded-lg border-2 shadow pl-2 h-10 mt-2 w-full focus:outline-blue-700"
              placeholder="Albar&aacute;n"
              onChange={(e) => filterFilesByNumber(e.target.value)}
            />
          </div>
        </div>
      ) : (
        ""
      )}
      <FilesListTable
        employee={employee}
        filteredFiles={filteredFiles}
        showVisibleFiles={showVisibleFiles}
        handleListAllFiles={handleListAllFiles}
        handleUpdateCompleted={handleUpdateCompleted}
        handleDeliveryFile={handleDeliveryFile}
        handleUpdateReviewed={handleUpdateReviewed}
        handleDeleteFile={handleDeleteFile}
      />
    </>
  );
};

export default FilesList;
