import { useEffect, useState } from "react";
import { useZxing } from "react-zxing";

const BarcodeScanner = ({setSearchValue}) => {
  const [result, setResult] = useState("");
  const [cameraOn, setCameraOn] = useState(false)

  const { ref } = useZxing({
    onDecodeResult(res) {
      if(res){
        setResult(res.getText());
      }
    },
    paused: !cameraOn
  });

  useEffect(() => {
    if(result){
      setSearchValue(result)
      setCameraOn(false)
    }
  }, [result])  

  return (
    <>
      <div>
        <div>
          {result 
            ? <div>
                <span>C&oacute;digo de barras:</span>
                <span>{result}</span>
              </div>
            : ""
          }

          {!cameraOn 
            ? <button onClick={() => setCameraOn(true)} className="bg-green-400 rounded-md p-2">Escanear</button>
            : 
            <div>
              <button onClick={() => setCameraOn(false)} className="bg-red-400 rounded-md p-2">Apagar c&aacute;mara</button>
              <video width="300" height="300" ref={ref} />
            </div>
          }
        </div>

      </div>
      
    </>
  );
};

export default BarcodeScanner