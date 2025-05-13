"use client";

import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";

const CameraPage = () => {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log(imageSrc); // You can handle the image data here
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      {/* Back Button */}
      <button onClick={() => window.history.back()} className="absolute top-4 left-4 bg-gray-700 text-white p-2 rounded">
        ← Back
      </button>

      {/* Webcam */}
      <div className="relative">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-80 h-96 border-4 border-gray-400 rounded-lg"
        />
        {/* Framing Overlay */}
        <div className="absolute inset-0 flex items-center justify-center border-4 border-gray-300 rounded-lg" />
      </div>

      {/* Capture Button */}
      <button
        onClick={capture}
        className="mt-4 bg-gray-800 text-white p-4 rounded-full"
      >
        📸 Capture
      </button>
    </div>
  );
};

export default CameraPage;
