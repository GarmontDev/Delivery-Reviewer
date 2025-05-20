import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

const BarcodeScanner = ({filterData}) => {

  const [qrScannerActive, setQrScannerActive] = useState(false);

  const handleScannerResult = (result) => {
    
    const scannedValue = result[0].rawValue;
    if (typeof scannedValue != "string") {
      return;
    }
    const isValidBarcode = scannedValue.length === 12 || scannedValue.length === 13;
    if (isValidBarcode) {
      filterData(scannedValue);
    } else {
      alert("Código de barras no válido");
    }
    setQrScannerActive(false);
  };

  return (
    <>
      {qrScannerActive ? (
        <div className="relative flex flex-col m-auto">
          <Scanner
            constraints={{ facingMode: "environment" }}
            components={{
              audio: true,
              onOff: false,
              torch: false,
              zoom: false,
              finder: true,
            }}
            formats={["ean_13", "ean_8", "code_39", "code_128"]}
     
            styles={{
              video: {
                width: 400,
                height: 400,
                marginLeft: 0,
                marginTop: 0,
              },
              container: {
                width: 400,
                height: 400,
              },
            }}
            onScan={(result) => handleScannerResult(result)}
            onError={(error) => console.log(error)}
            paused={!qrScannerActive}
          />
          <button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded"
            onClick={() => setQrScannerActive(false)}
          >
            Detener escáner
          </button>
        </div>
      ): 
      <div className="flex flex-col m-auto justify-center items-center">
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => setQrScannerActive(true)}
        >
          Iniciar escáner
        </button>
      </div>
      }
    </>
  );
};

export default BarcodeScanner;
