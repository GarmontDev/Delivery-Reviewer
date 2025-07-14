import { useState } from "react";
import { updateItem } from "../../../config/firebase";
import { useWithSound } from "./useWithSound";
import { useEmployeeContext } from "../../../context/EmployeeContext";

const EditItem = ({ item, setItemSelected, fileNumber, updateLocalData, setOpenEditItem }) => {
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
    updateItem(item, units, newCheck, incidents, fileNumber, notes, employee.name).then((res) => {
      if (res) {
        setItemSelected({
          ...item,
          unitsReceived: units,
          checked: newCheck,
          incidents: incidents,
          notes: notes,
          checkedby: employee.name,
        });
        if (employee.soundEffects) {
          if (!incidents) {
            playRightSound();
          } else {
            playWrongSound();
          }
        }
        setOpenEditItem(false);
        updateLocalData();
      }
    });
  }

  return (
    <>
      <form className="px-2 py-4 bg-white rounded-md text-base leading-relaxed text-gray-600">
        <div className="grid grid-rows-2 font-bold">
          <div className="text-xl flex justify-center">{item.code}</div>
          <p className="text-lg text-center rounded-md px-1 -mt-2">{item.description}</p>
        </div>
        <div className="flex flex-col mt-2 gap-y-4 justify-between text-center">
          <div className="flex place-items-center justify-between px-4">
            <h4>Cantidad anterior:</h4>
            <div className="text-xl w-20 h-4 font-semibold flex place-items-center">
              {item.unitsReceived}
              <p className="pl-2 font-normal">uds</p>
            </div>
          </div>
          <div className="flex place-items-center justify-between px-4">
            <p className="pr-2">Reemplazar con:</p>
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
            <p className="pl-2">uds</p>
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
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={(e) => (e.preventDefault(), handleEditting(item))}
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
      </form>
    </>
  );
};

export default EditItem;
