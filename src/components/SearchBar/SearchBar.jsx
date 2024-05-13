import XClearIcon from "../../assets/icons/XClearIcon";
import CBarras from "../../CBARRAS.json"
import "./SearchBar.css"
import {BarcodeDisabledIcon, BarcodeIcon} from "../../assets/icons/BarcodeIcon"

const SearchBar = ({data, keepSearchValue, setKeepSearchValue, isBarcode, setIsBarcode, setFilteredData, handleClearFilteredData, inputRef}) => { 

  const toogleKeepSearchValue = () => {setKeepSearchValue(!keepSearchValue)}
  const toggleBarcode = () => {setIsBarcode(!isBarcode)}

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

  function handleXButton(){
    setKeepSearchValue(false)
    handleClearFilteredData()
    searchInput.value = ""
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
              placeholder="Nombre o c&oacute;digo"
            />
            <button 
              className="search-x-button" 
              onClick={() => (handleXButton())}
            >
              <XClearIcon />
            </button>
          </div>
          <button 
            className={`flex mr-4 p-1 rounded-lg pl-2 pr-2 ${
              isBarcode ? " hover:bg-orange-300  bg-green-100"
              : "text-red-600 hover:bg-orange-300  bg-red-100"}`}
            onClick={() => toggleBarcode()}
          >
            <span className="pr-2">Barcode</span>
            {isBarcode ? <BarcodeIcon/> : <BarcodeDisabledIcon/>}
          </button>
      </div>
    </>
  )
 }

 export default SearchBar;