import { useEffect, useState } from 'react'
import { fetchReviewFiles, loadFile } from './config/firebase';
import './App.css'
import DeliveryNote from './components/DeliveryNote';
import DeliveryFiles from './components/DeliveryFiles';
import BarcodeScanner from './components/BarcodeScanner';

function App() {
  
  const [data, setData] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [reviewFileNumber, setReviewFileNumber] = useState("")
  const [searchValue, setSearchValue] = useState("")

  function handleFile () {
    var file = inputFile.files[0]
    var textType = /text.*/;
 
    if (file.type.match(textType) && fileNumber.value != "") {
      var reader = new FileReader();
  
      reader.onload = function(e) {
        var content = reader.result;
        // Here the content has been read successfuly
        loadFile(fileNumber.value,content)
          .then((res) => 
            setData(res),    
          )
      }
      reader.readAsText(file);  
    }else{
      alert("Either the file type doesn't match or the file number is not correct")
    }
  }

  useEffect(() => {
    if(searchValue){FilterData(searchValue)}
  }, [setSearchValue])
  
  
  function FilterData(value){
    setFilteredData(data.filter((item) =>
      item.description.toUpperCase().includes(value.toUpperCase())
      || item.code.includes(value)
      || item.barcode.includes(value)
    ))
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
  
  return (
    <>
      <div className="m-4 w-auto min-w-full">
        <div className='flex ml-4 p-2'>
          <input type="file" id="inputFile" onChange={(e) => handleFile(e)}/>
          <div className=''>
            Albar&aacute;n number
            <input id="fileNumber" className='w-20 ml-4 rounded-sm border-2 border-black bg-gray-200' />
          </div>
        </div>
        <div className='ml-4 mr-4'>
          <DeliveryFiles setReviewFileNumber={setReviewFileNumber}/>
        </div>
        <div className="ml-4 mr-4 pl-2 pr-4 rounded-t-sm pt-2 pb-2 bg-gray-400 flex justify-between">
          <div className='flex'>
            <input id='searchInput' className='w-auto rounded-sm' onChange={(e) => FilterData(e.target.value)}/>
          </div>
          <div className='flex justify-between pl-2'>
            Albar&aacute;n {reviewFileNumber}
          </div>
        </div>
          <div className='ml-4 mt-4'>
            <BarcodeScanner setSearchValue={setSearchValue}/>
          </div>
        {filteredData ? <DeliveryNote data={filteredData} setData={setData} reviewFileNumber={reviewFileNumber}/> : ""}
      </div>
    </>
  )
}

export default App
