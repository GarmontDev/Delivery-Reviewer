import { Scanner } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";

const BarcodeScanner = ({ filterData }) => {
  const [qrScannerActive, setQrScannerActive] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === "videoinput");
    if (videoDevices.length > 0) {
      setVideoDevices(videoDevices);
    }
    return videoDevices;
  }

  useEffect(() => {
    getDevices();
  }, []);
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
      {videoDevices.length > 0 && qrScannerActive ? (
        <div className="relative flex flex-col m-auto">
          <div className="bg-gray-200 p-2 rounded-t-md text-center">
            <select
              onChange={(e) => setSelectedDevice(e.target.value)}
              defaultValue={selectedDevice}
              className="w-full p-2 rounded"
            >
              <option value="">Seleccionar cámara</option>
              {videoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Cámara ${device.deviceId}`}
                </option>
              ))}
            </select>
          </div>
          <Scanner
            constraints={{ deviceId: selectedDevice }}
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
      ) : (
        <div className="flex flex-col m-auto justify-center items-center">
          {videoDevices.length === 0 ? (
            <p className="text-red-500 text-sm">Escáner no disponible.</p>
          ) : (
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              onClick={() => setQrScannerActive(true)}
            >
              Iniciar escáner
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default BarcodeScanner;
