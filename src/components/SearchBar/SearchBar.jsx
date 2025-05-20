import XClearIcon from "../../assets/icons/XClearIcon";

import { BarcodeDisabledIcon, BarcodeIcon } from "../../assets/icons/BarcodeIcon";
import { useEffect } from "react";

const SearchBar = ({
  filterData,
  setKeepSearchValue,
  isBarcode,
  setIsBarcode,
  handleClearFilteredData,
  openEditItem,
  inputRef,
}) => {

  const toggleBarcode = () => {
    setIsBarcode(!isBarcode);
  };

  useEffect(() => {
    if (!openEditItem && inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, [openEditItem]);

  function handleXButton() {
    setKeepSearchValue(false);
    handleClearFilteredData();
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }

  return (
    <>
      <div className="place-items-center place-content-center flex justify-between w-full mr-2 pl-2">
        <div className="flex md:ml-20 gap-x-2">
          <input
            id="searchInput"
            ref={inputRef}
            autoFocus={true}
            maxLength={20}
            className="bg-white border h-9 pl-2 w-full max-w-sm rounded-md"
            onChange={(e) => filterData(e.target.value)}
            placeholder="C&oacute;digo/nombre"
          />
          <button className="p-1 rounded-md border border-red-400 hover:bg-red-100" onClick={() => handleXButton()}>
            <XClearIcon stroke={"red"} />
          </button>
        </div>
        <button
          className={`flex p-1 ml-2 rounded-md px-2 hover:bg-red-400 ${
            isBarcode ? "bg-green-400" : "text-red-600 bg-red-100"
          }`}
          onClick={() => toggleBarcode()}
        >
          {isBarcode ? <BarcodeIcon /> : <BarcodeDisabledIcon />}
        </button>
      </div>
    </>
  );
};

export default SearchBar;
