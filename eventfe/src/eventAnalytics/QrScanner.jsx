// QrScannerComponent.jsx
import React, { useState } from 'react';
import { useZxing } from 'react-zxing';

const QrScanner = ({ onResult }) => {
  const [paused, setPaused] = useState(false);

  const { ref } = useZxing({
    onDecodeResult(result) {
      onResult(result.getText());
      setPaused(true); // Pause scanning after a successful scan
    },
    paused,
  });

  return (
    <div>
      {!paused && <video ref={ref} />}
      {paused && (
        <button onClick={() => setPaused(false)}>Scan Again</button>
      )}
    </div>
  );
};

export default QrScanner;
