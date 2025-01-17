import { useState } from "react";
import { updateItem } from "../../../config/firebase";
import { useEmployeeContext } from "../../../context/EmployeeContext";
import { useWithSound } from "./useWithSound";

const EditItem = ({ item, setItemSelected, fileNumber, setOpenEditItem }) => {
  const [units, setUnits] = useState(item.unitsReceived);
  const [notes, setNotes] = useState(item.notes);
  const [newCheck, setNewCheck] = useState(item.checked);

  const { employee } = useEmployeeContext();

  const handleUnitsChange = (e) => {
    e.preventDefault();
    setUnits(Number(e.target.value));

    if (item.unitsBilled === Number(e.target.value)) {
      setNewCheck(true);
    } else {
      setNewCheck(false);
    }
  };

  const handleItemNotes = (e) => {
    e.preventDefault();
    setNotes(e.target.value);
  };

  const { playRightSound } = useWithSound();
  const { playWrongSound } = useWithSound();

  function handleEditting(item) {
    const incidents = item.unitsBilled != units;
    updateItem(
      item,
      units,
      newCheck,
      incidents,
      fileNumber,
      notes,
      employee.name
    ).then((res) => {
      if (res) {
        setItemSelected({
          ...item,
          unitsReceived: units,
          checked: newCheck,
          incidents: incidents,
          notes: notes,
          checkedby: employee.name,
        });
        if (!incidents) {
          playRightSound();
        } else {
          playWrongSound();
        }
        setOpenEditItem(false);
      }
    });
  }

  return (
    <>
      <div className="relative -top-14 bg-gray-50 rounded-md p-2 text-base leading-relaxed text-gray-600 ml-2 mr-2">
        <div className="grid grid-rows-2 font-bold">
          <div className="text-xl flex justify-center">{item.code}</div>
          <p className="text-lg text-center rounded-md pl-1 pr-1 -mt-2">
            {item.description}
          </p>
        </div>
        <div className="grid grid-rows-2 px-2 text-center justify-center items-center">
          <div className="flex">
            <h4>Cantidad anterior:</h4>
            <div className="text-xl w-20 h-4 font-semibold">
              {item.unitsReceived}
            </div>
          </div>
          <div className="flex place-items-center ">
            <p className="mr-2">Reemplazar con:</p>
            <input
              type="number"
              inputMode="numeric"
              id="unitsReceivedInput"
              value={units}
              autoFocus
              max={9999}
              maxLength={5}
              onChange={handleUnitsChange}
              onFocus={(e) => e.target.select()}
              className="w-24 h-14 text-center text-xl rounded-md border-2 border-gray-200"
            />
            <p className="ml-2">uds</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 border-t mt-2 border-gray-200 rounded-b">
          <button
            type="button"
            className="py-2.5 px-5 ms-3 text-sm font-medium text-red-600 focus:outline-none bg-white rounded-lg border border-red-600 hover:bg-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700"
            onClick={() => setOpenEditItem(false)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={() => handleEditting(item)}
          >
            Aceptar
          </button>
        </div>
        <div className="flex items-center p-4 justify-between border-t border-gray-200 rounded-b">
          <input
            type="text"
            id="itemNotes"
            maxLength={40}
            value={notes}
            onChange={handleItemNotes}
            className="w-full h-12 pl-2 bg-gray-100 rounded-md border-2"
            placeholder="Notas"
          />
        </div>
      </div>
    </>
  );
};

export default EditItem;
