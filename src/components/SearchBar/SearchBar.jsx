import XClearIcon from "../../assets/icons/XClearIcon";
import CBarras from "../../CBARRAS.json"
import { useEmployeeContext } from "../../context/EmployeeContext";
import "./SearchBar.css"
import { useNavigate } from "react-router-dom";
import {BarcodeDisabledIcon, BarcodeIcon} from "../../assets/icons/BarcodeIcon"

const SearchBar = ({data, keepSearchValue, setKeepSearchValue, isBarcode, setIsBarcode, setFilteredData, handleClearFilteredData, reviewFileNumber, inputRef}) => { 
  const navigate = useNavigate();

  const toogleKeepSearchValue = () => {setKeepSearchValue(!keepSearchValue)}
  const toggleBarcode = () => {setIsBarcode(!isBarcode)}

  const {employee} = useEmployeeContext()

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
        <div className="search-header">
          <div className="font-bold text-xl text-slate-800 pl-1 pb-2">
            Alb. {reviewFileNumber}
          </div>
          <div className="search-employee-name">
            {employee.name}
          </div>
        </div>
        <div className="search-toolbar">
          <div className="relative flex h-8 md:ml-20">
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
            className="w-6 ml-24 md:ml-10"
            onClick={() => toggleBarcode()}
          >
            {isBarcode ? <BarcodeIcon/> : <BarcodeDisabledIcon/>}
          </button>
          <button 
            className='search-file-back-button'
            onClick={() => navigate("/home")}
          >
           Volver
          </button>
        </div>
      </div>
    </>
  )
 }

 export default SearchBar;