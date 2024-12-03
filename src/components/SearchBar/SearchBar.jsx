import XClearIcon from "../../assets/icons/XClearIcon";
import CBarras from "../../CBARRAS.json";
import "./SearchBar.css";
import {
  BarcodeDisabledIcon,
  BarcodeIcon,
} from "../../assets/icons/BarcodeIcon";
import { useEffect, useRef } from "react";

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
          setFilteredData(
            data.filter((element) => element.code.includes(item.CODEARTI))
          );
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
    if(inputRef.current){
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }

  return (
    <>
      <div className="main-search-bar">
        <div className="search-input-container">
          <input
            id="searchInput"
            ref={inputRef}
            autoFocus
            maxLength={20}
            className="search-input"
            onChange={(e) => filterData(e.target.value)}
            placeholder="C&oacute;digo/nombre"
          />
          <button className="search-x-button" onClick={() => handleXButton()}>
            <XClearIcon stroke={"black"} />
          </button>
        </div>
        <button
          className={`flex ml-2 p-1 rounded-lg pl-2 pr-2 ${
            isBarcode ? "barcode-enabled-btn" : "barcode-disabled-btn"
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
