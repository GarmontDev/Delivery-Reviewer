import { useState } from "react";
import BarcodeSearch from "../../pages/BarcodeSearch";
import { addLineManually } from "../../config/firebase";

const ManualLine = ({ data, filteredData, setFilteredData, reviewFileNumber }) => {
  const [codeArti, setCodeArti] = useState("");

  function handleAddLineManually(codeArti, descArti, unitsArti) {
    addLineManually(
      reviewFileNumber,
      codeArti.CODEARTI,
      descArti.value,
      unitsArti.value
    );

    let newArti = {code: codeArti.CODEARTI,
      description: descArti.value,
      unitsBilled: 0,
      unitsReceived: unitsArti.value,
      incidents: false,
      checked: false,
      checkedby: "",
      notes: "",
      time: "",}

    setFilteredData(data => [...data, newArti]);
  }

  return (
    <>
      <div className="border-2 ml-2 mr-2 mb-2 p-2 rounded-md">
        <form className="">
          <div className="grid grid-cols-2">
            <BarcodeSearch codeArti={codeArti} setCodeArti={setCodeArti} />
          </div>
          <input
            id="descArti"
            name="descArti"
            maxLength={20}
            className="border-2 rounded-md pt-0.5 pl-2 mt-2 w-full"
            placeholder="Descripci&oacute;n"
            required
          />
          <input
            id="unitsArti"
            name="unitsArti"
            maxLength={10}
            className="border-2 rounded-md pt-0.5 w-20 text-left mt-2 pl-2"
            placeholder="Uds"
            required
          />
          <button
            type="button"
            className="menu-visible-button col-span-2 bg-blue-600 h-10 w-full mt-4"
            onClick={() => handleAddLineManually(codeArti, descArti, unitsArti)}
          >
            Añadir
          </button>
        </form>
      </div>
    </>
  );
};

export default ManualLine;
