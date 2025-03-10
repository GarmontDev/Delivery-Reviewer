import { useNavigate } from "react-router-dom";
import XClearIcon from "../assets/icons/XClearIcon";
import { useRef, useState } from "react";
import CBarras from "../CBARRAS.json"

const BarcodeSearch = ({codeArti, setCodeArti}) => {
  const navigate = useNavigate();

  const inputRef = useRef(null);

  function filterData(value){
    if(Number(value)){
      CBarras.CBARRAS.find((item) => {
        if(item.CODE === value){
          setCodeArti(item)
        }
      })
    }else{
      setCodeArti("No encontrado")
    }
  } 

  function handleXButton(){
    setCodeArti("")
    searchInput.value = ""
  }

  return (
    <>
      <div className="relative mt-4">
        <div className="flex place-content-start">
          <input 
            id='searchInput' 
            ref={inputRef}
            autoFocus
            maxLength={20}
            className='search-input w-40' 
            onChange={(e) => (e.preventDefault(), filterData(e.target.value))} 
            placeholder="C&oacute;digo de barras"
          />
          <button
            type="button" 
            className="search-x-button" 
            onClick={() => handleXButton()}
          >
            <XClearIcon stroke={"black"}/>
          </button>
          <div className="text-lg flex place-content-center font-semibold mt-1 ml-2">
            C&oacute;digo: {codeArti?.CODEARTI}
          </div>
        </div>
      </div>
    </>
  );
};

export default BarcodeSearch;