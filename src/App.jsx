import { useEffect, useState } from 'react'
import { fetchReviewFiles, loadFile } from './config/firebase';
import './App.css'
import DeliveryNote from './components/DeliveryNote';
import DeliveryFiles from './components/DeliveryFiles';
import Html5QrcodePlugin from './components/Html5QrcodePlugin';
import Scanner from './components/Scanner';
import Scandit from './components/Scandit';

function App() {
  
  const [data, setData] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [reviewFileNumber, setReviewFileNumber] = useState("")
  const [searchValue, setSearchValue] = useState("")
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
 
  function FilterData(value){
    setFilteredData(data.filter((item) =>
      item.description.toUpperCase().includes(value.toUpperCase())
      || item.code.includes(value)
      || item.barcode.includes(value)
    ))
    console.log(filteredData)
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

  function handleScannerResult(result){
    searchInput = result
    FilterData(result)
  }


  
  return (
    <>
      <div className="m-4">
        <div className='bg-gray-200 ml-4 mr-4 overflow-clip'>
          <div className='mr-4 p-2'>
            <input type="file" id="inputFile" onChange={(e) => handleFile(e)}/>
          </div>
          <div className='mb-4'>
              Albar&aacute;n number
              <input id="fileNumber" className='w-28 ml-4 mr-4 mb-2 rounded-sm border-2 border-black bg-white' />
          </div>
        </div>
        <DeliveryFiles setReviewFileNumber={setReviewFileNumber}/>
        <div className="pl-2 pr-4 rounded-t-sm pt-2 pb-2 bg-gray-400 flex justify-between">
          <div className='flex'>
            <input id='searchInput' className='w-auto rounded-sm' onChange={(e) => FilterData(e.target.value)}/>
          </div>
          <div className='flex justify-between pl-2'>
            Albar&aacute;n {reviewFileNumber}
          </div>
        </div>
          <div className='mt-4 w-full h-auto'>
            {openScanner 
              ? <div>
                  <button onClick={() => setOpenScanner(false)} className='border-2 rounded-md bg-red-400 p-2'>Stop Scan</button>
                  <Scandit/>
                </div>
              : <button onClick={() => setOpenScanner(true)} className='border-2 rounded-md bg-green-400 p-2'>Escanear</button>
            }
            
            {/* <Scanner setSearchValue={handleScannerResult}/> */}
            
          </div>
        {filteredData ? <DeliveryNote data={filteredData} setData={setData} reviewFileNumber={reviewFileNumber}/> : ""}
      </div>
    </>
  )
}

export default App
