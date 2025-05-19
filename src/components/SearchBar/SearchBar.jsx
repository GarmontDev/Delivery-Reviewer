import XClearIcon from "../../assets/icons/XClearIcon";
import CBarras from "../../CBARRAS.json";
import { BarcodeDisabledIcon, BarcodeIcon } from "../../assets/icons/BarcodeIcon";
import { useEffect } from "react";

const SearchBar = ({
  data,
  keepSearchValue,
  setKeepSearchValue,
  isBarcode,
  setIsBarcode,
  setFilteredData,
  handleClearFilteredData,
  openEditItem,
  setOpenEditItem,
  inputRef,
}) => {
  const toogleKeepSearchValue = () => {
    setKeepSearchValue(!keepSearchValue);
  };
  const toggleBarcode = () => {
    setIsBarcode(!isBarcode);
  };

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
            className="bg-white border h-9 pl-2 w-40 rounded-md"
            onChange={(e) => filterData(e.target.value)}
            placeholder="C&oacute;digo/nombre"
          />
          <button className="p-1 rounded-md hover:bg-white" onClick={() => handleXButton()}>
            <XClearIcon stroke={"red"} />
          </button>
        </div>
        <button
          className={`flex ml-2 p-1 rounded-md pl-2 pr-2 hover:bg-red-400 ${
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
