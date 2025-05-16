import "./DeliveryNote.css";
import {
  fetchDeliveryNote,
  updateCompleted,
  updateFile,
  updateIncidents,
} from "../../config/firebase";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";

import EditItem from "./EditItem/EditItem.jsx";

import NotesIcon from "../../assets/icons/NotesIcon";
import SearchBar from "../SearchBar/SearchBar";
import { useEmployeeContext } from "../../context/EmployeeContext";
import CheckIcon from "../../assets/icons/CheckIcon";
import EmptyCheckIcon from "../../assets/icons/EmptyCheckIcon";

import EmployeeIdle from "../EmployeeIdle/EmployeeIdle.jsx";
import { toast, ToastContainer } from "react-toastify";
import { notifyError, notifySuccess } from "../../utils/toastify.jsx";

const isMobile = window.innerWidth <= 768;

const DeliveryNote = () => {
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const reviewFileNumber = location.state?.reviewFileNumber;
  const reviewFileDate = location.state?.createdDate;
  const [reviewFileVisible, setReviewFileVisible] = useState(location.state?.visible);
  const [reviewFileIncidents, setReviewFileIncidents] = useState(location.state?.incidents);
  const [reviewFileCompleted, setReviewFileCompleted] = useState(location.state?.completed);

  const { employee } = useEmployeeContext();
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [itemSelected, setItemSelected] = useState(null);
  const [openEditItem, setOpenEditItem] = useState(false);
  const [keepSearchValue, setKeepSearchValue] = useState(false);
  const [selectStatus, setSelectStatus] = useState("all-filter");
  const [isBarcode, setIsBarcode] = useState(true);

  useEffect(() => {
    if (typeof employee.name === "undefined") {
      navigate("/home");
    }
    if (data === null) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    handleClearFilteredData();
  }, [data]);

  function fetchData() {
    if (reviewFileNumber != "") {
      fetchDeliveryNote(reviewFileNumber).then((res) => {
        setData(res), setFilteredData(res);
      });
    }
  }

  function updateLocalData() {
    setData(
      data.map((item) => {
        if (item.code === itemSelected.code) {
          return itemSelected;
        } else {
          return item;
        }
      })
    );
  }

  function handleClearFilteredData() {
    if (!keepSearchValue) {
      handleSelectStatusChange(selectStatus);
      setIsBarcode(true);
    }
  }

  function handleUpdateCompleted(number, completed) {
    if (!completed) {
      if (window.confirm("¿Marcar este albarán como completado?")) {
        updateCompleted(number, completed).then((res) => {
          setReviewFileCompleted(!completed);
        });
      }
    } else {
      if (window.confirm("Marcar este albarán como NO completado?")) {
        updateCompleted(number, completed).then((res) => {
          setReviewFileCompleted(!completed);
        });
      }
    }
  }

  function handleSelectStatusChange(value) {
    switch (value) {
      case "all-filter":
        setSelectStatus("all-filter");
        setFilteredData(data);
        break;
      case "pending-filter":
        setSelectStatus("pending-filter");
        setFilteredData(data.filter((item) => item.unitsReceived === 0));
        break;
      case "incidents-filter":
        setSelectStatus("incidents-filter");
        setFilteredData(data.filter((item) => item.incidents === true));
        break;
      default:
        break;
    }
  }

  function handleRefreshIncidents() {
    const confirmation = window.confirm(
      "¿Deseas actualizar el estado del albarán? Esto marcará los artículos no revisados como incidencias"
    );

    if (confirmation) {
      updateIncidents(reviewFileNumber).then((res) => {
        setReviewFileIncidents(res);
        if (res) {
          notifyError({
            message: "¡Albarán con incidencias!",
          });
        } else {
          notifySuccess({
            message: "¡Todo en orden!",
          });
        }
      });
    }
  }

  return (
    <>
      {employee ? <EmployeeIdle /> : ""}
      <div className="delivery-note-container m-2 rounded-md">
        <Popup
          modal
          position="top center"
          nested
          open={openEditItem}
          onClose={() => (updateLocalData(), setOpenEditItem(false))}
          repositionOnResize
        >
          <EditItem
            item={itemSelected}
            setItemSelected={setItemSelected}
            fileNumber={reviewFileNumber}
            setOpenEditItem={setOpenEditItem}
            setData={setData}
            setFilteredData={setFilteredData}
            setReviewFileIncidents={setReviewFileIncidents}
          />
        </Popup>
        <div className="delivery-note-header">
          <div className="delivery-note-file-number -mt-2">
            <div className="text-sm text-gray-600 -mb-2">Albar&aacute;n</div>
            {reviewFileNumber}
            <div className="delivery-note-file-info">Fecha</div>
            {typeof reviewFileDate === "string"
              ? reviewFileDate
              : new Date(reviewFileDate?.toMillis?.() || 0).toLocaleDateString()}
          </div>
          <div className="grid grid-cols-2 gap-y-2">
            <button
              disabled={!employee.admin}
              className="disabled:cursor-not-allowed"
              onClick={() => {
                handleUpdateCompleted(reviewFileNumber, reviewFileCompleted);
              }}
            >
              <div className="delivery-note-file-number flex gap-1 ">
                Listo
                {reviewFileCompleted ? (
                  <div className="pt-1">
                    <CheckIcon size={20} />
                  </div>
                ) : (
                  <div className="pt-1">
                    <EmptyCheckIcon size={20} />
                  </div>
                )}
              </div>
            </button>
            <button
              className="flex place-content-around"
              onClick={() =>
                updateFile(
                  reviewFileNumber,
                  reviewFileIncidents,
                  reviewFileCompleted,
                  !reviewFileVisible
                ).then((res) => {
                  if (res) {
                    setReviewFileVisible(!reviewFileVisible);
                  }
                })
              }
            >
              {reviewFileVisible ? (
                <div className="text-red-400 hover:text-white hover:bg-red-400 bg-white pl-2 pr-2 pt-0.5 pb-1 rounded-md font-semibold">
                  Ocultar
                </div>
              ) : (
                <div className="text-green-600 hover:text-white hover:bg-green-600 bg-white border-2 border-green-600 hover:border-white pl-2 pr-2 pt-0.5 pb-1 rounded-md font-semibold">
                  Activar
                </div>
              )}
            </button>
            <div className="col-span-2">
              {reviewFileIncidents ? (
                <div className="delivery-note-file-number text-center text-black bg-yellow-400 hover:bg-yellow-600 hover:text-white  pl-2 pr-2 pb-1 rounded-md">
                  <button onClick={() => handleRefreshIncidents()}>Con Incidencias</button>
                </div>
              ) : (
                <div className="delivery-note-file-number text-center text-black bg-green-400 hover:bg-green-800 hover:text-white pl-2 pr-2 pb-1 rounded-md">
                  <button onClick={() => handleRefreshIncidents()}>Sin incidencias</button>
                </div>
              )}
            </div>
          </div>
          <div className="grid place-items-end">
            <button className="go-back-button" onClick={() => navigate("/home")}>
              Volver
            </button>
            <div className="delivery-note-employee-name">
              {isMobile
                ? employee.name.slice(0, 3).toUpperCase()
                : employee.name.slice(0, 6).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
      <div className="ml-2 mb-2">
        <div className="flex">
          <form>
            <select
              id="visible-lines"
              defaultValue="all-filter"
              className={`w-auto border border-gray-300 h-9 pl-1
                text-slate-800 font-bold text-sm rounded-md 
                focus:ring-blue-500 focus:border-blue-500 
                
                ${selectStatus === "all-filter" ? "bg-green-400" : ""}
                ${selectStatus === "pending-filter" ? "bg-blue-400" : ""}
                ${selectStatus === "incidents-filter" ? "bg-yellow-300" : ""}
              `}
              onChange={(e) => handleSelectStatusChange(e.target.value)}
            >
              <option value="all-filter">Todas</option>
              <option value="pending-filter">Pendientes</option>
              <option value="incidents-filter">Incidencias</option>
            </select>
          </form>

          <SearchBar
            data={data}
            isBarcode={isBarcode}
            setIsBarcode={setIsBarcode}
            setFilteredData={setFilteredData}
            handleClearFilteredData={handleClearFilteredData}
            reviewFileNumber={reviewFileNumber}
            keepSearchValue={keepSearchValue}
            setKeepSearchValue={setKeepSearchValue}
            openEditItem={openEditItem}
            setOpenEditItem={setOpenEditItem}
            inputRef={inputRef}
          />
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md ml-2 mr-2 rounded-sm">
        <table className="note-table">
          <thead className="delivery-note-table-head">
            <tr>
              <th className="px-3 w-10">Rec</th>
              <th className="px-3 w-80 lg:w-96">Descripci&oacute;n</th>
              <th className="w-20">Facturado</th>
              <th className="px-3 w-8">Notas</th>
              <th className="px-16 w-20">Revisado</th>
            </tr>
          </thead>
          <tbody className="odd:bg-white even:bg-gray-50 border-b">
            {filteredData?.map((item, index) => (
              <tr
                key={item.code + "-" + index}
                className={`h-20 text-base border-b border-gray-400 ${
                  item?.checked
                    ? "bg-green-200"
                    : item?.incidents
                    ? "bg-yellow-100 "
                    : "odd:bg-white even:bg-gray-100"
                }`}
                onClick={() => (setItemSelected(item), setOpenEditItem(true))}
              >
                <td
                  scope="col"
                  className="font-bold text-lg flex text-left place-content-center pt-6 text-green-600"
                >
                  {item.unitsReceived}
                </td>

                <th className="px-3 truncate">
                  <p className="flex gap-x-2">
                    {item.code}
                    {item.notes ? <NotesIcon /> : ""}
                  </p>
                  {item.description.charAt(0).toUpperCase() +
                    item.description.slice(1).toLowerCase()}
                </th>
                <td scope="col" className="px-4 flex place-content-center">
                  {item.unitsBilled}
                </td>
                <td scope="col" className="px-4 ">
                  {item.notes ? <NotesIcon /> : ""}
                </td>
                <td className="px-16">{item.checkedby}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ToastContainer limit={4} />
      </div>
    </>
  );
};

export default DeliveryNote;
