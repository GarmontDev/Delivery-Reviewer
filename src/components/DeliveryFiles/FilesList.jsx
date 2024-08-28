import AlertTriangleIcon from "../../assets/icons/AlertTriangleIcon.jsx";
import { EyeOpenIcon } from "../../assets/icons/EyeIcon.jsx";
import { EyeOffIcon } from "../../assets/icons/EyeIcon.jsx";
import CheckIcon from "../../assets/icons/CheckIcon.jsx";
import EmptyCheckIcon from "../../assets/icons/EmptyCheckIcon.jsx";
import {
  deleteFile,
  deleteFileFromCollections,
  fetchHiddenFilesByDate,
  listAllFiles,
  updateCompleted,
  updateFile,
  updateIncidents,
} from "../../config/firebase.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryFiles.css";
import CustomDatePicker from "../CustomDatePicker/CustomDatePicker.jsx";
import DeleteIcon from "../../assets/icons/DeleteIcon.jsx";

const FilesList = ({ employee, showVisibleFiles }) => {
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

  function handleDeliveryFile(number, createdDate, completed, incidents) {
    navigate("/notes", {
      state: {
        reviewFileNumber: number.toString(),
        createdDate: createdDate,
        completed: completed,
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
      {/* MARK: Files List
       */}
      {filteredFiles?.length > 0 ? (
        <div className="delivery-files-items-container">
          {filteredFiles?.map((item, index) => (
            <div
              className="grid grid-cols-2 grid-rows-2
              bg-white border-2 rounded-lg m-2 w-full h-14 text-gray-900"
              key={item + "-" + index}
            >
              <button
                className="grid grid-rows-2 grid-cols-1 ml-2 hover:text-blue-600"
                onClick={() =>
                  handleDeliveryFile(
                    item.number,
                    item.createdDate,
                    item.completed,
                    item.incidents
                  )
                }
              >
                <div
                  id={item}
                  className="font-semibold flex justify-start pl-1 pt-1"
                >
                  {item.number}
                  <p className="ml-2 font-medium text-gray-600">
                    {typeof item.createdDate === "string"
                      ? item.createdDate
                      : new Date(
                          item.createdDate.seconds * 1000
                        ).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-44 py-2.5 px-1 flex text-blue-700">
                  {item.description}
                </div>
              </button>
              <div className="grid grid-rows-1 grid-cols-4 pt-4 ml-2">
                <div className="w-8">
                  {item.incidents ? <AlertTriangleIcon /> : ""}
                </div>
                <div className="w-5">
                  {item.completed ? (
                    <button
                      disabled={!employee.admin}
                      className="disabled:cursor-not-allowed"
                      onClick={() => {
                        handleUpdateCompleted(item.number, item.completed);
                      }}
                    >
                      <CheckIcon size={25} />
                    </button>
                  ) : (
                    <button
                      disabled={!employee.admin}
                      className="disabled:cursor-not-allowed"
                      onClick={() => {
                        handleUpdateCompleted(item.number, item.completed);
                      }}
                    >
                      <EmptyCheckIcon size={21} />
                    </button>
                  )}
                </div>
                {employee.admin ? (
                  <div className="w-5">
                    {item.visible ? (
                      <button
                        onClick={() => (
                          updateFile(
                            item.number,
                            item.incidents,
                            item.completed,
                            false
                          ),
                          handleListAllFiles(showVisibleFiles)
                        )}
                      >
                        <EyeOpenIcon />
                      </button>
                    ) : (
                      <button
                        onClick={() => (
                          updateFile(
                            item.number,
                            item.incidents,
                            item.completed,
                            true
                          ),
                          handleListAllFiles(showVisibleFiles)
                        )}
                      >
                        <EyeOffIcon />
                      </button>
                    )}
                  </div>
                ) : (
                  ""
                )}
                {employee.admin ? (
                  <div className="w-5">
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Seguro que deseas eliminar este albarán?"
                          )
                        )
                          handleDeleteFile(item.number);
                      }}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-files-available">No hay albaranes disponibles</div>
      )}
    </>
  );
};

export default FilesList;
