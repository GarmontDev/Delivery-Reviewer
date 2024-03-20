import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useZxing } from 'react-zxing';

const BarcodeScanner = () => {

  const [scan, setScan] = useState(null);
  const { deviceId } = useParams();

  const { ref } = useZxing({
    onResult(newScan) {
      setScan(newScan);
    },
    deviceId
  });

  return (
    <>
      <video width="300" ref={ref} />
    </>);
}

export default BarcodeScanner