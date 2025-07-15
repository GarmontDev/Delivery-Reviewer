import {
  fetchDeliveryNote,
  updateCompleted,
  updateFile,
  updateIncidents,
} from "../../config/firebase";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import CBarras from "../../CBARRAS.json";

import EditItem from "./EditItem/EditItem.jsx";

import NotesIcon from "../../assets/icons/NotesIcon";
import SearchBar from "../SearchBar/SearchBar";
import { useEmployeeContext } from "../../context/EmployeeContext";
import CheckIcon from "../../assets/icons/CheckIcon";
import EmptyCheckIcon from "../../assets/icons/EmptyCheckIcon";

import EmployeeIdle from "../EmployeeIdle/EmployeeIdle.jsx";
import { ToastContainer } from "react-toastify";
import { notifyError, notifySuccess } from "../../utils/toastify.jsx";
import BarcodeScanner from "../BarcodeScanner/BarcodeScanner.jsx";
import "../../utils/popup-window.css";

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

function updateLocalData(updatedItem) {
  const updatedData = data.map((item) =>
    item.code === updatedItem.code ? updatedItem : item
  );
  setData(updatedData);

  switch (selectStatus) {
    case "pending-filter":
      setFilteredData(updatedData.filter((item) => item.unitsReceived === 0));
      break;
    case "incidents-filter":
      setFilteredData(updatedData.filter((item) => item.incidents === true));
      break;
    default:
      setFilteredData(updatedData);
      break;
  }
}

  function filterData(value) {
    if (isBarcode && Number(value)) {
      CBarras.CBARRAS.find((item) => {
        if (item.CODE === value) {
          setFilteredData(data.filter((element) => element.code.includes(item.CODEARTI)));
        }
      });
    } else {
      setIsBarcode(false);
      setFilteredData(
        data.filter(
          (item) =>
            item.description.toUpperCase().includes(value.toUpperCase()) ||
            item.code.includes(value)
        )
      );
    }
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
      {openEditItem && itemSelected && (
        <div className="popup-window">
          <EditItem
            item={itemSelected}
            setItemSelected={setItemSelected}
            fileNumber={reviewFileNumber}
            setOpenEditItem={setOpenEditItem}
            setData={setData}
            setFilteredData={setFilteredData}
            setReviewFileIncidents={setReviewFileIncidents}
            updateLocalData={updateLocalData}
          />
        </div>
      )}
      <div
        className={
          openEditItem
            ? "blurred"
            : "flex flex-col items-center content-center justify-center gap-y-2"
        }
      >
        <div className="flex w-full max-w-3xl items-center justify-between px-4 py-2 lg:rounded-md shadow-md border-l border-r border-b">
          <div className="grid grid-rows-2">
            <div className="grid">
              <p className="text-gray-400">Albar&aacute;n</p>
              <span className="font-semibold -mt-1">{reviewFileNumber}</span>
            </div>
            <div className="">
              <p className="text-gray-400">Fecha</p>
              <span className="font-semibold">
                {typeof reviewFileDate === "string"
                  ? reviewFileDate
                  : new Date(reviewFileDate?.toMillis?.() || 0).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 mx-4 gap-y-2 gap-x-2 col-span-2 items-center">
            <button
              disabled={!employee.admin}
              className="disabled:cursor-not-allowed"
              onClick={() => {
                handleUpdateCompleted(reviewFileNumber, reviewFileCompleted);
              }}
            >
              <div className="flex text-center justify-center content-center items-center gap-x-1 ">
                {reviewFileCompleted ? <CheckIcon size={24} /> : <EmptyCheckIcon size={24} />}
                <p className="text-blue-700 font-semibold">Listo</p>
              </div>
            </button>
            <button
              disabled={!employee.admin}
              className={
                "col-span-2 flex text-center justify-center items-center py-1 rounded-md border h-8 hover:bg-white disabled:cursor-not-allowed" +
                (reviewFileVisible
                  ? " bg-red-100 text-red-700 border-red-400"
                  : " bg-green-100 text-green-700 ")
              }
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
              {reviewFileVisible ? "Ocultar" : "Activar"}
            </button>
            <button
              disabled={!employee.admin}
              onClick={() => handleRefreshIncidents()}
              className={
                "col-span-3 flex text-center justify-center border hover:text-white rounded-md disabled:cursor-not-allowed" +
                (reviewFileIncidents
                  ? " bg-yellow-100 text-yellow-700 border-yellow-700"
                  : " bg-green-100 text-green-700 border-green-700")
              }
            >
              {reviewFileIncidents ? "Con incidencias" : "Sin incidencias"}
            </button>
          </div>
          <div className="grid grid-rows-2 gap-x-2 place-items-end">
            <button
              className="h-10 w-auto px-2 py-1 flex items-center justify-center rounded-md shadow-md bg-blue-700 hover:bg-blue-500 text-white text-sm"
              onClick={() => navigate("/home")}
            >
              Volver
            </button>

            <span className="h-8 w-auto flex items-center justify-center bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
              {employee.name.slice(0, 6).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex w-full max-w-3xl items-center justify-between px-2 py-1">
          <form>
            <select
              id="visible-lines"
              defaultValue="all-filter"
              className={`w-auto border border-gray-300 h-9
                text-slate-800 font-bold text-sm rounded-md 
                focus:ring-blue-500 focus:border-blue-500 
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
            filterData={filterData}
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
        <div>
          <BarcodeScanner filterData={filterData} />
        </div>
        <div className="flex w-full max-w-3xl items-center justify-between">
          <table className="w-full table-fixed overflow-x-scroll mx-2 text-sm text-gray-700 select-none border-gray-200 border">
            <thead className="text-xs h-8 text-slate-700 bg-gray-100 uppercase">
              <tr>
                <th className="text-center w-14">Rec.</th>
                <th className="text-left w-64 lg:w-96">Descripci&oacute;n</th>
                <th className="text-center w-20">Notas</th>
                <th className="text-center w-20">Facturado</th>
                <th className="text-center w-20">Revisado</th>
              </tr>
            </thead>
            <tbody className="border-b">
              {filteredData?.map((item, index) => (
                <tr
                  key={item.code + "-" + index}
                  className={`h-20 text-base border-b-2 border-gray-200 ${
                    item?.checked ? "bg-green-100" : item?.incidents ? "bg-yellow-100 " : ""
                  }`}
                  onClick={() => (setItemSelected(item), setOpenEditItem(true))}
                >
                  <td className="font-semibold text-lg flex text-center justify-center place-content-center pt-6 text-slate-700">
                    {item.unitsReceived}
                  </td>
                  <th className="text-left text-wrap truncate font-normal text-slate-800">
                    <p className="font-semibold text-sm text-blue-700">{item.code}</p>
                    {item.description.charAt(0).toUpperCase() +
                      item.description.slice(1).toLowerCase()}
                  </th>
                  <td className="flex justify-center ">{item.notes ? <NotesIcon /> : ""}</td>
                  <td className="text-center">{item.unitsBilled}</td>
                  <td className="text-center">{item.checkedby}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer limit={4} />
    </>
  );
};

export default DeliveryNote;
