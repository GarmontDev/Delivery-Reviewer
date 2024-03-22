import { useState } from "react";
import Html5QrcodePlugin from "./Html5QrcodePlugin";
import { Html5QrcodeScanType, Html5QrcodeSupportedFormats } from "html5-qrcode";

const Scanner = ({setSearchValue}) => { 
  const [result, setResult] = useState("");

  const onNewScanResult = (decodedText, decodedResult) => {
    if(decodedResult){
      setResult(decodedText)
      setSearchValue(decodedText)
    }
  };

  return(
    <>
      <div>
        {result}
      </div>
      <div className="">
          <Html5QrcodePlugin qrCodeSuccessCallback={onNewScanResult}/>
      </div>
    </>
  )
 }

 export default Scanner