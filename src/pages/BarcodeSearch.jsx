import { useNavigate } from "react-router-dom";
import XClearIcon from "../assets/icons/XClearIcon";
import { useRef, useState } from "react";
import CBarras from "../CBARRAS.json"

const BarcodeSearch = () => {
  const navigate = useNavigate();

  const [data, setData] = useState()
  const inputRef = useRef(null);

  function filterData(value){
    if(Number(value)){
      CBarras.CBARRAS.find((item) => {
        if(item.CODE === value){
          setData(item)
        }
      })
    }else{
      setData("No encontrado")
    }
  } 

  function handleXButton(){
    setData("")
    searchInput.value = ""
  }

  return (
    <>
      <div className="relative mt-4">
        <h1>Search Barcode</h1>
        <div className="flex place-content-center">
          <input 
            id='searchInput' 
            ref={inputRef}
            autoFocus
            maxLength={20}
            className='search-input' 
            onChange={(e) => filterData(e.target.value)} 
            placeholder="Nombre o c&oacute;digo"
          />
          <button 
            className="search-x-button" 
            onClick={() => (handleXButton())}
          >
            <XClearIcon />
          </button>
        </div>
        {data ? 
          <div className="text-xl flex place-content-center mt-4">
            C&oacute;digo: {data?.CODEARTI}
          </div>
        : ""}
        <button
          className="absolute right-4 top-2 text-sm pl-2 pr-2 pt-1 pb-1 bg-red-500 text-white border-2 border-red-500 rounded-md hover:bg-red-700 hover:text-white"
          onClick={() => navigate("/home")}
        >
          Volver
        </button>
      </div>
    </>
  );
};

export default BarcodeSearch;