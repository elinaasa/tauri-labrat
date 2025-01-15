import { RefObject, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const UseFaceDetection = () => {
  const [detection, setDetection] = useState<faceapi.FaceDetection | null>(
    null
  ); // Detected face

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        console.log('Models loaded');
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };
    loadModels();
  }, []);

  const getDescriptors = async (videoRef: RefObject<HTMLVideoElement>) => {
    if (!videoRef.current) {
      return;
    }
    const result = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!result) {
      console.error('No face detected');
      return;
    }

    setDetection(result.detection);
  };

  return { detection, getDescriptors };
};

export default UseFaceDetection;
