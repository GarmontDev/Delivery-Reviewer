import "./DeliveryNote.css"
import { fetchReviewFiles } from "../../config/firebase";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";

import EditItem from "../EditItem"
import AlertTriangleIcon from "../../assets/icons/AlertTriangleIcon"
import ClipboardIcon from "../../assets/icons/ClipboardIcon"
import ClipboardEmptyIcon from "../../assets/icons/ClipboardEmptyIcon"
import XClearIcon from "../../assets/icons/XClearIcon"
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

  useEffect(() => {
    refreshData()
  }, [])

  function refreshData(){
    if(reviewFileNumber != ""){
      fetchReviewFiles(reviewFileNumber)
      .then((res) =>{
          setData(res),
          setFilteredData(res)
        }
      )
    }
  }

  function filterData(value){
    if(isNaN(Number(value))){
      setFilteredData(data.filter((item) =>
        item.description.toUpperCase().includes(value.toUpperCase())
        || item.code.includes(value)
      ))
    }else{
        CBarras.CBARRAS.find((item) => {
          if(item.CODE === value){
            setFilteredData(data.filter((element) => element.code.includes(item.CODEARTI)))
          }
        })
    }

    if(filteredData.length === 0){
      alert("No se han encontrado productos que correspondan con: "+ value)
      handleClearFilteredData()
    }
  }

  function handleClearFilteredData(){
    setFilteredData(data)
    searchInput.value = ""
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

  function handleEditItem(item){
    setItemSelected(item)
    setOpenEditItem(true)
  }

  return(
    <>
      <div className="pt-4 pb-4 pl-2 pr-2 bg-gray-300 flex justify-between">
        <Popup 
          modal
          nested
          open={openEditItem} 
          onClose={() => (setOpenEditItem(false), refreshData())} 
          repositionOnResize
          position="top center"
         >    
          <EditItem item={itemSelected} fileNumber={reviewFileNumber} setOpenEditItem={setOpenEditItem} setData={setData} setFilteredData={setFilteredData}/>
        </Popup>
        <div className="flex h-8 relative">
          <input id='searchInput' className='rounded-sm pl-1 ml-1' onChange={(e) => filterData(e.target.value)} placeholder="Nombre o c&oacute;digo"/>
          <button 
            className="p-1 absolute top-0 right-0 hover:bg-red-400" 
            onClick={() => handleClearFilteredData()}
          >
            <XClearIcon />
          </button>
        </div>
        <button className='albaran-button'
                onClick={() => navigate("/home")}
        >
          Albar&aacute;n {reviewFileNumber}
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
        <button className="filter-button bg-[#F7BE38]  hover:bg-[#f79e38]"
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
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
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
              {/* <th className="px-2 w-16">
                Barcode
              </th> */}
              <th className="px-16 w-20">
                Revisado
              </th>
            </tr>
          </thead>
          <tbody className="odd:bg-white even:bg-gray-50 border-b">
            {filteredData?.map((item, index) => (
              <tr key={index} 
                className={`${
                  item?.checked ? "bg-green-200" 
                :  item?.incidents ? "bg-yellow-100" : "odd:bg-white even:bg-gray-100"}`}
                onClick={() => handleEditItem(item)}
              >  
                <td className="px-2 py-3 text-center">
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
                {/* <td className="px-2">
                  {item.barcode}
                </td>                 */}
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