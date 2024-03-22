

import * as SDCCore from 'scandit-web-datacapture-core';
import * as SDCBarcode from 'scandit-web-datacapture-barcode';
import { useEffect } from 'react';

const licenseKey = "AfBUpmDUROMJQknepzRcvVM9o+aWQobna09/Ut4OYeLkI2jF2mPosrdfkI0eDQrf8BfMbItmfHWSTKRlWD4mqydRlizvBQ2fRQx1ogcyl/SeLM/lLUONZ1RJ61s7xlEUmUoc5UFRIJbOTjD2qz4U70xrTgIud86LEPRnxyjXBswu7TFxnSVfJoFpgXQ4DlH/LfnG0zqTTVyN0jCHh2cL/SXpZPSxRfwEuv81/fZjj85GhLsuCM35oYLMLiqQd4xq2T0lBPz9bzTA8C1PMgdpDyXD9pHo8B/DSaoRwINcEs71FEaOkg6g8OtZ+62Zc4vJ7JPRKC/PpOHcIjXHx6swtwGcR4ivDahnHeKDZeTvTBe6utyi8v5DmeKnoSLHe6WjN9TQoDwFIoeKADQG4tVRhBQH25yEmsWyWTEUXbrzh0ads1S2ViYsizk0Mzbaf5WUmXeEmqUJeueVLocbQZsNZngfBOz/TvdgfFQmdppRDo4EOIumIPi6p3g4wIErywyFGv12GRbDHDPfLBGHVpqlfa5sFS2OGjTpg6JIj7lojaRkkHyVLrgQAsbXdzZ4qSnbmBIP7A5IxlV2l09pGSAYDyO29L2XIflerIFFX192zsg1BNv7hk5PBGz21A0XFlJm8W1Ju8FRKcPUP7HIyUm6Xa75hfmnv+xLrfZFWCau7QXVzpkMMd4uYZNpefkRqbZ0VWpwkhnPgJtuYQ3UvlygWG/pRqMY4iIXXJythJGGCFJnXsPpWZFF1LRVGVGPBHwJzQyF45xMv4ISdePsYXH2MBikwNVePQbv";

 const Scandit = () => {
   useEffect(() => {
     async function runScanner() {
       await SDCCore.configure({
       licenseKey: licenseKey,
      libraryLocation: "https://cdn.jsdelivr.net/npm/scandit-web-datacapture-barcode@6.x/build/engine/",
       moduleLoaders: [SDCBarcode.barcodeCaptureLoader()]
     });

     const context = await SDCCore.DataCaptureContext.create();

     const camera = SDCCore.Camera.default;
     await context.setFrameSource(camera);

     const settings = new SDCBarcode.BarcodeCaptureSettings();
     settings.enableSymbologies([
       SDCBarcode.Symbology.Code128,
       SDCBarcode.Symbology.EAN8,
       SDCBarcode.Symbology.EAN13UPCA
     ]);

     const symbologySetting = settings.settingsForSymbology(SDCBarcode.Symbology.Code39);
     symbologySetting.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

     const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(context, settings);
     await barcodeCapture.setEnabled(false);

     barcodeCapture.addListener({
       didScan: async (barcodeCapture, session) => {
         await barcodeCapture.setEnabled(false);
         const barcode = session.newlyRecognizedBarcodes[0];
         const symbology = new SDCBarcode.SymbologyDescription(barcode.symbology);
         showResult(barcode.data, symbology.readableName);
         await barcodeCapture.setEnabled(true);
       },
     });

     const view = await SDCCore.DataCaptureView.forContext(context);
     view.connectToElement(document.getElementById("data-capture-view"));
     view.addControl(new SDCCore.CameraSwitchControl()); 

     const barcodeCaptureOverlay = 
       await SDCBarcode.BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
       barcodeCapture,
       view,
       SDCBarcode.BarcodeCaptureOverlayStyle.Frame
     );

     const viewfinder = new SDCCore.RectangularViewfinder(
       SDCCore.RectangularViewfinderStyle.Square,
       SDCCore.RectangularViewfinderLineStyle.Light
     );

     await barcodeCaptureOverlay.setViewfinder(viewfinder); 

     await camera.switchToDesiredState(SDCCore.FrameSourceState.On);
     await barcodeCapture.setEnabled(true);
  }

  function showResult(data, symbology) {
    alert("Scanned: "+data+" "+symbology);
  }

  runScanner().catch((error) => {
    console.error(error);
    alert(error);
    });
  }, []);

  return(
    <div id="data-capture-view"></div>
  )

};

export default Scandit;

