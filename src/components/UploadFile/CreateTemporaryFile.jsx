import "./UploadFile.css";
import { useNavigate } from "react-router-dom";
import {
  addToListOfCollections,
} from "../../config/firebase";
import CustomDatePicker from "../CustomDatePicker/CustomDatePicker";
import { useState } from "react";

const CreateTemporaryFile = () => {
  const navigate = useNavigate();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [datePicked, setDatePicked] = useState(new Date());

  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  function createNewTemporaryFile() {
    if (fileDescription.value != "" && datePicked.toLocaleDateString() != "") {
      addToListOfCollections(
        randomNumberInRange(77777777, 79999999).toString(),
        fileDescription.value,
        datePicked
      ).then((res) => {
        if (res) {
          console.log("Added to list of collections");
          navigate("/home");
        } else {
          console.log("Error loading to list of collection");
        }
      });
    } else {
      alert("Error");
    }
  }

  return (
    <>
      <main className="rounded-lg p-2 grid justify-center">
        <form>
          <h1>Entrada albar&aacute;n temporal</h1>
          <div>
            <label htmlFor="fileDescription">Descripci&oacute;n</label>
            <input
              type="text"
              id="fileDescription"
              name="fileDescription"
              className="text-input"
              placeholder="Ex: pedido camión"
              required
            />
          </div>

          <div>
            <label htmlFor="fileDescription">Fecha</label>
            <div>
              {calendarOpen ? (
                <CustomDatePicker
                  calendarOpen={calendarOpen}
                  setCalendarOpen={setCalendarOpen}
                  datePicked={datePicked}
                  setDatePicked={setDatePicked}
                  isRange={false}
                />
              ) : (
                <button
                  className="text-input text-left"
                  onClick={() => setCalendarOpen(true)}
                >
                  {datePicked.toLocaleDateString()}
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={() => createNewTemporaryFile()}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default CreateTemporaryFile;
