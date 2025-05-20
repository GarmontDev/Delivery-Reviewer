import {
  deleteFile,
  deleteFileFromCollections,
  fetchHiddenFilesByDate,
  listAllFiles,
  updateCompleted,
  updateReviewed,
} from "../../../config/firebase.js";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../DeliveryFiles.css";
import CustomDatePicker from "../../CustomDatePicker/CustomDatePicker.jsx";
import FilesListTable from "./FilesListTable.jsx";
import VisibleFilesOptionBtn from "../VisibleFilesOptionBtn.jsx";
import { useEmployeeContext } from "../../../context/EmployeeContext.jsx";
import EmployeeIdle from "../../EmployeeIdle/EmployeeIdle.jsx";
import { notifySuccess } from "../../../utils/toastify.jsx";

const FilesList = ({ showVisibleFiles, setShowVisibleFiles }) => {
  const navigate = useNavigate();
  const { employee } = useEmployeeContext();

  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [datePicked, setDatePicked] = useState([new Date(new Date() - 7 * 86400000), new Date()]);
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
    setFilteredFiles(
      files.filter((file) => file.description.toUpperCase().includes(value.toUpperCase()))
    );
  }

  function handleDeliveryFile(number, createdDate, completed, incidents, visible) {
    navigate("/notes", {
      state: {
        reviewFileNumber: number.toString(),
        createdDate: createdDate,
        completed: completed,
        incidents: incidents,
        visible: visible,
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
            notifySuccess({
              message: "Albarán eliminado con éxito",
            });
          } else {
            notifyError({
              message: "Ha ocurrido un error eliminando el albarán",
            });
          }
        });
      }
    });
  }

  return (
    <>
      {employee ? <EmployeeIdle /> : ""}
      <div className="flex flex-col items-center">
        {employee.admin && (
          <VisibleFilesOptionBtn
            showVisibleFiles={showVisibleFiles}
            setShowVisibleFiles={setShowVisibleFiles}
          />
        )}
        {!showVisibleFiles && (
          <div className="flex flex-col h-auto w-full max-w-md content-center items-center justify-center bg-white rounded-lg shadow-lg p-4 mt-2">
            <div className="w-full">
              <div id="inactive-files-date" className="flex justify-between">
                <span className="p-1 pr-2 mt-3 ml-1">Fecha</span>
                <div className="flex items-center justify-center w-auto max-w-56">
                  {calendarOpen ? (
                    <CustomDatePicker
                      calendarOpen={calendarOpen}
                      setCalendarOpen={setCalendarOpen}
                      datePicked={datePicked}
                      setDatePicked={setDatePicked}
                      isRange={true}
                    />
                  ) : (
                    <button className="text-input" onClick={() => setCalendarOpen(true)}>
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
        )}
      </div>

      <FilesListTable
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
