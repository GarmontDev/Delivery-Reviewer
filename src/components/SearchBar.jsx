import { useState } from "react";

const SearchBar = ({data}) => { 
  const [filteredData, setFilteredData] = useState(data)
  
  function FilterData(){
    setFilteredData(data.filter((item) =>
      item.description.toUpperCase().includes(searchInput.value.toUpperCase())
      || item.code.includes(searchInput.value)
      || item.barcode.includes(searchInput.value)
    ))
  }

  return(
    <>
      <input id='searchInput' className='w-auto rounded-sm' onChange={() => FilterData()}/>
    </>
  )
 }

 export default SearchBar;