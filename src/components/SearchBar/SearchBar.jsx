import XClearIcon from "../../assets/icons/XClearIcon";
import CBarras from "../../CBARRAS.json"
import "./SearchBar.css"
import {BarcodeDisabledIcon, BarcodeIcon} from "../../assets/icons/BarcodeIcon"
import { useEffect, useState } from "react";
import PlusIcon from "../../assets/icons/PlusIcon";

const SearchBar = ({data, keepSearchValue, setKeepSearchValue,newLineFieldVisible, setNewLineFieldVisible, isBarcode, setIsBarcode, setFilteredData, handleClearFilteredData, openEditItem, setOpenEditItem, inputRef}) => { 

  const toogleKeepSearchValue = () => {setKeepSearchValue(!keepSearchValue)}
  const toggleBarcode = () => {setIsBarcode(!isBarcode)}

  const toggleNewLineFieldVisible = () => {setNewLineFieldVisible(!newLineFieldVisible)}

  function filterData(value){
    if(isBarcode && Number(value)){
      CBarras.CBARRAS.find((item) => {
        if(item.CODE === value){
          setFilteredData(data.filter((element) => element.code.includes(item.CODEARTI)))
        }
      })
    }else{
      setIsBarcode(false)
      setFilteredData(data.filter((item) =>
        item.description.toUpperCase().includes(value.toUpperCase())
        || item.code.includes(value)
      ))
    }
  }

  useEffect(() => {
    if(!openEditItem){
      searchInput.value = ""
      searchInput.focus()
    }
  }, [openEditItem])

  function handleXButton(){
    setKeepSearchValue(false)
    handleClearFilteredData()
    searchInput.value = ""
    searchInput.focus()
  }

  return(
    <>
      <div className="main-search-bar">
          <div className="search-input-container">
            <input 
              id='searchInput' 
              ref={inputRef}
              autoFocus
              maxLength={20}
              className='search-input' 
              onChange={(e) => filterData(e.target.value)} 
              placeholder="C&oacute;digo/nombre"
            />
            <button 
              className="search-x-button" 
              onClick={() => (handleXButton())}
            >
              <XClearIcon stroke={"black"}/>
            </button>
          </div>
          <button 
            className={`flex mr-2 ml-2 p-1 rounded-lg pl-2 pr-2 ${
              isBarcode ? "barcode-enabled-btn"
              : "barcode-disabled-btn"}`}
            onClick={() => toggleBarcode()}
          >
            {/* <span className="pr-2">Barcode</span> */}
            {isBarcode ? <BarcodeIcon/> : <BarcodeDisabledIcon/>}
          </button>
          <button 
            className="flex mr-2 p-1 rounded-lg border-2 border-gray-600"
            onClick={() => toggleNewLineFieldVisible()}
          >
            <PlusIcon size={20}/>
          </button>
      </div>
    </>
  )
 }

 export default SearchBar;