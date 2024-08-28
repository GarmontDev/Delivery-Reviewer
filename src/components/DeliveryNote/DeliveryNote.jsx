import "./DeliveryNote.css";
import {
  fetchDeliveryNote,
  updateCompleted,
  updateIncidents,
} from "../../config/firebase";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";

import EditItem from "../EditItem/EditItem";

import NotesIcon from "../../assets/icons/NotesIcon";
import SearchBar from "../SearchBar/SearchBar";
import { useEmployeeContext } from "../../context/EmployeeContext";
import CheckIcon from "../../assets/icons/CheckIcon";
import EmptyCheckIcon from "../../assets/icons/EmptyCheckIcon";

const DeliveryNote = () => {
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const reviewFileNumber = location.state?.reviewFileNumber;
  const reviewFileDate = location.state?.createdDate;
  const [reviewFileIncidents, setReviewFileIncidents] = useState(
    location.state?.incidents
  );
  const [reviewFileCompleted, setReviewFileCompleted] = useState(
    location.state?.completed
  );

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
    updateIncidents(reviewFileNumber).then((res) => {
      setReviewFileIncidents(res);
    });
  }

  return (
    <>
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
            {new Date(reviewFileDate.toMillis()).toLocaleDateString()}
          </div>
          <div>
            <button
              disabled={!employee.admin}
              className="disabled:cursor-not-allowed"
              onClick={() => {
                handleUpdateCompleted(reviewFileNumber, reviewFileCompleted);
              }}
            >
              <div className="delivery-note-file-number flex gap-2">
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
            {reviewFileIncidents ? (
              <div className="delivery-note-file-number text-black bg-yellow-300 mt-2 pl-2 pr-2 pb-1 rounded-md">
                <button onClick={() => handleRefreshIncidents()}>
                  Con Incidencias
                </button>
              </div>
            ) : (
              <div className="delivery-note-file-number text-white bg-green-400 mt-2 pl-2 pr-2 pb-1 rounded-md">
                <button onClick={() => handleRefreshIncidents()}>
                  Sin incidencias
                </button>
              </div>
            )}
          </div>
          <div>
            <div className="delivery-note-employee-name">
              {employee.name.slice(0, 3).toUpperCase()}
            </div>
            <button
              className="go-back-button"
              onClick={() => navigate("/home")}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
      <div className="flex">
        <form className="search-input-container ml-2 mb-2 h-9">
          <select
            id="visible-lines"
            className={`w-auto border border-gray-300 
              text-slate-800 font-bold text-sm rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 
              
              ${selectStatus === "all-filter" ? "bg-green-400" : ""}
              ${selectStatus === "pending-filter" ? "bg-blue-400" : ""}
              ${selectStatus === "incidents-filter" ? "bg-yellow-300" : ""}
            `}
            onChange={(e) => handleSelectStatusChange(e.target.value)}
          >
            <option value="all-filter" selected>
              Todas
            </option>
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
      <div className="relative overflow-x-auto shadow-md ml-2 mr-2 rounded-md">
        <table className="note-table">
          <thead className="delivery-note-table-head">
            <tr>
              <th className="px-2 py-2 w-14 text-center">C&oacute;d.</th>
              <th className="px-1.5 w-6">Rec.</th>
              <th className="px-3 w-8">Fact</th>
              <th className="px-3 w-screen lg:w-96">Descripci&oacute;n</th>
              <th className="px-3 w-8">Notas</th>
              <th className="px-16 w-20">Revisado</th>
            </tr>
          </thead>
          <tbody className="odd:bg-white even:bg-gray-50 border-b">
            {filteredData?.map((item, index) => (
              <tr
                key={item.code + "-" + index}
                className={`${
                  item?.checked
                    ? "bg-green-200 border-2"
                    : item?.incidents
                    ? "bg-yellow-100 border-2 border-gray-200"
                    : "odd:bg-white even:bg-gray-100 border-2 border-gray-200"
                }`}
                onClick={() => (setItemSelected(item), setOpenEditItem(true))}
              >
                <td className={"px-2 py-2.5 text-center"}>{item.code}</td>
                <td scope="col" className="px-4">
                  {item.unitsReceived}
                </td>
                <td scope="col" className="px-4">
                  {item.unitsBilled}
                </td>
                <th className="px-3">
                  {item.description.charAt(0).toUpperCase() +
                    item.description.slice(1).toLowerCase()}
                </th>
                <td scope="col" className="px-4">
                  {item.notes ? <NotesIcon /> : ""}
                </td>
                <td className="px-16">{item.checkedby}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DeliveryNote;
