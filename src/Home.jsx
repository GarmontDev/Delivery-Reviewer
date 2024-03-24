import { useEffect, useState } from 'react'
import { fetchReviewFiles, loadFile, logout } from './config/firebase';
import DeliveryNote from './components/DeliveryNote';
import DeliveryFiles from './components/DeliveryFiles';
import Scandit from './components/Scandit';

import { StartBarcodeScannerIcon, StopBarcodeScannerIcon } from "./assets/icons/BarcodeScannerIcon"
import AlertTriangleIcon from "./assets/icons/AlertTriangleIcon"

function App() {
  
  const [data, setData] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [reviewFileNumber, setReviewFileNumber] = useState("")
  const [openScanner, setOpenScanner] = useState(false)

  function handleFile () {
    var file = inputFile.files[0]
    var textType = /text.*/;
 
    if (file.type.match(textType) && fileNumber.value != "") {
      var reader = new FileReader();
  
      reader.onload = function(e) {
        var content = reader.result;
        // Here the content has been read successfuly
        loadFile(fileNumber.value,content)
          .then((res) =>{
            if(res){
              setData(res)
            }else{
              alert("No content on the text file")
            }
          })
      }
      reader.readAsText(file);  
    }else{
      alert("Either the file type doesn't match or the file number is not correct")
    }
  }
 
  useEffect(() => {
    if(reviewFileNumber != ""){
      fetchReviewFiles(reviewFileNumber)
      .then((res) =>{
          setData(res),
          setFilteredData(res)
        }
      )
    }
  }, [reviewFileNumber])

  function filterData(value){
    setFilteredData(data.filter((item) =>
      item.description.toUpperCase().includes(value.toUpperCase())
      || item.code.includes(value)
      || item.barcode.includes(value)
    ))
    if(filteredData.length > 0){setOpenScanner(false)}
  }

  function handleScannerResult(result){
    filterData(result)
  }


  
  return (
    <>
      <div className="m-4 bg-gray-50 dark:bg-gray-900 h-screen">
        <div className='bg-white ml-4 mr-4 overflow-clip'>
          <div className='mr-4 p-2'>
            <input type="file" id="inputFile" onChange={(e) => handleFile(e)}/>
          </div>
          <div className='mb-4'>
              Albar&aacute;n number
              <input id="fileNumber" className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
          </div>
        </div>
        <DeliveryFiles setReviewFileNumber={setReviewFileNumber}/>
        
        <div className="pl-2 pr-4 rounded-t-sm pt-2 pb-2 bg-gray-400 flex justify-between">
          <div className='flex'>
            <input id='searchInput' className='w-auto rounded-sm' onChange={(e) => filterData(e.target.value)}/>
          </div>
          <div className='flex justify-between pl-2'>
            Albar&aacute;n {reviewFileNumber}
          </div>
        </div>
          <div className='mt-2 mb-2 w-full h-auto flex justify-between'>
            {openScanner && data != undefined
              ? <div>
                  <button onClick={() => setOpenScanner(false)} className="text-sm px-2 py-2 font-medium text-center inline-flex items-center text-white bg-red-700 rounded-md hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                    <StopBarcodeScannerIcon/>
                    Stop Scan
                  </button>
                </div>
              // : <button onClick={() => setOpenScanner(true)} className={`border-2 rounded-md p-2 ${data != undefined ? "bg-green-400" : "bg-red-400"}`}>Escanear</button>
              : <button onClick={() => setOpenScanner(true)} className="text-sm px-2 py-2 font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                  <StartBarcodeScannerIcon/>
                  Escanear
                </button>
            }
            <button className="text-sm px-2 font-medium text-center inline-flex items-center text-gray-900 bg-[#F7BE38] rounded-md hover:bg-[#b49243] focus:ring-4 focus:outline-none focus:ring-blue-300">
              <AlertTriangleIcon/>
              Ver Incidencias
            </button>
          </div>
          {openScanner && data != undefined ? <Scandit handleScannerResult={handleScannerResult}/> : ""}
        {filteredData ? <DeliveryNote data={filteredData} setData={setData} reviewFileNumber={reviewFileNumber}/> : ""}
      </div>
      <div >
        <button onClick={() => logout()} className='absolute top-0 right-0 text-sm m-2 pl-2 pr-2 pt-1 pb-1 bg-red-400 border-2 border-red-700 rounded-md hover:bg-red-700 hover:text-white'>
          Salir
        </button>
      </div>
    </>
  )
}

export default App
