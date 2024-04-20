import "./DeliveryNote.css"
import { fetchDeliveryNote } from "../../config/firebase";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";

import EditItem from "../EditItem"
import AlertTriangleIcon from "../../assets/icons/AlertTriangleIcon"
import ClipboardIcon from "../../assets/icons/ClipboardIcon"
import ClipboardEmptyIcon from "../../assets/icons/ClipboardEmptyIcon"
import XClearIcon from "../../assets/icons/XClearIcon"
import NotesIcon from "../../assets/icons/NotesIcon"
import CBarras from "../../CBARRAS.json"

const DeliveryNote = () => { 
  const navigate = useNavigate();
  const location = useLocation();
  const reviewFileNumber = location.state?.reviewFileNumber;

  const [data, setData] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [openScanner, setOpenScanner] = useState(false)
  const [itemSelected, setItemSelected] = useState(null)
  const [openEditItem, setOpenEditItem] = useState(false);
  const [isBarcode, setIsBarcode] = useState(true)

  const toggleBarcode = () => {setIsBarcode(!isBarcode)}

  const inputRef = useRef(null);

  useEffect(() => {
    if(data === null){
      fetchData()
    }
  }, [])

  useEffect(() => {
    handleClearFilteredData()
    searchInput.value = ""
  },[data])

  function fetchData(){
    if(reviewFileNumber != ""){
      fetchDeliveryNote(reviewFileNumber)
      .then((res) =>{
          setData(res),
          setFilteredData(res)
        }
      )
    }
  }

  function updateLocalData(){
    setData(data.map((item) => {
      if(item.code === itemSelected.code){
        return itemSelected
      }else{
        return item
      }
    }))
  }

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

  function handleClearFilteredData(){
    setFilteredData(data)
    searchInput.value = ""
    setIsBarcode(true)
  }

  function displayIncidents(){
    setFilteredData(data.filter((item) =>
      item.incidents === true
    ))
  }

  function displayNotReviewed(){
    setFilteredData(data.filter((item) =>
      item.unitsReceived === 0
    ))
  }

  function handleScannerResult(result){
    filterData(result)
  }

  return(
    <>
      <div className="delivery-note-container">
        <Popup 
          modal
          position="top center"
          nested
          open={openEditItem} 
          onClose={() => (updateLocalData(), setOpenEditItem(false), inputRef.current.focus())} 
          repositionOnResize
         >    
          <EditItem 
            item={itemSelected} 
            setItemSelected={setItemSelected} 
            fileNumber={reviewFileNumber} 
            setOpenEditItem={setOpenEditItem} 
            setData={setData} 
            setFilteredData={setFilteredData}
          />
        </Popup>
        <div className="flex h-8 relative">
          <input 
            id='searchInput' 
            ref={inputRef}
            autoFocus
            maxLength={20}
            className='rounded-sm pl-1 ml-1 w-40' 
            onChange={(e) => filterData(e.target.value)} 
            placeholder="Nombre o c&oacute;digo"
          />
          <button 
            className="p-1 relative top-0 right-8 hover:bg-red-400" 
            onClick={() => handleClearFilteredData()}
          >
            <XClearIcon />
          </button>
          <label className="flex items-center mb-5 cursor-pointer">
            <input type="checkbox" value="" checked={isBarcode} onChange={() => toggleBarcode()} className="sr-only peer"/>
            <div className="relative w-9 h-5 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-2 text-sm font-medium text-gray-900">Barcode</span>
          </label>
        </div>
        <button className='albaran-button'
                onClick={() => navigate("/home")}
        >
          {reviewFileNumber}
        </button>
      </div>
      <div className='m-2 h-8 flex justify-between'>
        <button className="filter-button bg-green-400 hover:bg-green-600"
          onClick={() => handleClearFilteredData()}
        >
          <ClipboardIcon/>
          Ver todo
        </button>
        <button className="filter-button bg-blue-400 hover:bg-blue-600"
                onClick={() => displayNotReviewed()}
        >
          <ClipboardEmptyIcon/>
          No repasado
        </button>
        <button className="filter-button bg-[#F7BE38] hover:bg-[#f79e38]"
                onClick={() => displayIncidents()}
        >
          <AlertTriangleIcon/>
          Incidencias
        </button>
      </div>
      {openScanner && data != undefined ? 
        <Html5QrcodePlugin handleScannerResult={handleScannerResult}/> 
      : ""}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="note-table">
          <thead className="delivery-note-table-head">
            <tr>
              <th className="px-2 py-2 w-14 text-center">
                C&oacute;d.
              </th>
              <th className="px-1.5 w-6">
                Rec.
              </th>
              <th className="px-3 w-8">
                Fact
              </th>
              <th className="px-3 w-screen lg:w-96">
                Descripci&oacute;n
              </th>
              <th className="px-3 w-8">
                Notas
              </th>
              <th className="px-16 w-20">
                Revisado
              </th>
            </tr>
          </thead>
          <tbody className="odd:bg-white even:bg-gray-50 border-b">
            {filteredData?.map((item, index) => (
              <tr key={item.code+"-"+index} 
                className={`${
                  item?.checked ? "bg-green-200" 
                :  item?.incidents ? "bg-yellow-100" : "odd:bg-white even:bg-gray-100"}`}
                onClick={() => (setItemSelected(item), setOpenEditItem(true))}
              >  
                <td className={"px-2 py-1.5 text-center"}>
                  {item.code} 
                </td>
                <td scope="col" className="px-4">
                  {item.unitsReceived}
                </td>
                <td scope="col" className="px-4">
                  {item.unitsBilled}
                </td>
                <th className="px-3">
                  {item.description}
                </th>
                <td scope="col" className="px-4">
                  {item.notes ? <NotesIcon/> : ""}
                </td>
                <td className="px-16">
                  {item.checkedby}
                </td>
              </tr>        
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
 }

 export default DeliveryNote;