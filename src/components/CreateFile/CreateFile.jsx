import "./CreateFile.css"
import { useNavigate } from "react-router-dom";
import { addToListOfCollections, loadFile } from "../../config/firebase";

const CreateFile = () => { 

  const navigate = useNavigate()

  function createNewFile () {
    if(inputFile.files[0] === undefined){
      return alert("Please select a file")
    }
    var file = inputFile.files[0]
    var textType = /text.*/;
 
    if (file.type.match(textType) && fileNumber.value != "" && fileDescription.value != "" && fileDate.value != "") {
      var reader = new FileReader();
  
      reader.onload = function(e) {
        var content = reader.result;

        loadFile(fileNumber.value, content)
          .then((res) =>{
            if(res){
              addToListOfCollections(fileNumber.value, fileDescription.value, fileDate.value)
              .then((res) => {
                if(res){
                  console.log("Added to list of collections")
                  navigate("/home")
                }else{
                  console.log("Error loading to list of collection")
                }
              })
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

  return(
    <>
      <main className="rounded-lg p-2 grid justify-center">
        <form>
          <h1>
            Subir nuevo albar&aacute;n
          </h1>
          <input 
            className="input-file" 
            id="inputFile" 
            type="file"
          />
          <p className="mt-1 text-sm text-gray-500" id="file_input_help">S&oacute;lo archivos txt.</p>
          <div>
            <label htmlFor="fileNumber">N&uacute;mero de albar&aacute;n</label>
            <input 
              type="text" 
              id="fileNumber" 
              name="fileNumber"
              className="text-input" 
              placeholder="Ex: 01205490" 
              required 
            />
          </div>
          <div>
            <label htmlFor="fileDescription">
              Descripci&oacute;n
            </label>
            <input 
              type="text" 
              id="fileDescription" 
              name="fileDescription" 
              className="text-input" 
              placeholder="Ex: pedido camión" 
              required 
            />
          </div>
          <div>
            <label htmlFor="fileDescription">
              Fecha
            </label>
            <input 
              type="text" 
              id="fileDate" 
              name="fileDate" 
              className="text-input" 
              placeholder={new Date().toLocaleDateString()}
              required 
            />
          </div>
          <div className="mt-4 flex justify-between">
            <button type="button" onClick={() => createNewFile()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Aceptar
            </button>
            <button type="button" onClick={() => navigate("/home")} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </>
  ) 
}

export default CreateFile