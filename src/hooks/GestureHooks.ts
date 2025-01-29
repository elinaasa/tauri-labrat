import { RefObject, useEffect, useState } from 'react';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';

const useGestureRecognition = (videoRef: RefObject<HTMLVideoElement>) => {
  const [gesture, setGesture] = useState('');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let gestureRecognizer: GestureRecognizer | null = null;

    const initializeGestureRecognizer = async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks('/wasm');
      gestureRecognizer = await GestureRecognizer.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath: '/models/gesture_recognizer.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        }
      );
    };

    const processVideoFrames = async () => {
      if (videoRef.current && gestureRecognizer) {
        const nowInMs = Date.now();
        const results = gestureRecognizer.recognizeForVideo(
          videoRef.current,
          nowInMs
        );
        results.gestures.forEach((categories) => {
          categories.forEach((category) => {
            const currentGesture = category.categoryName;
            if (currentGesture !== gesture) {
              if (
                currentGesture === 'Thumb_Up' ||
                currentGesture === 'Thumb_Down'
              ) {
                setGesture(currentGesture);
              }
            }
          });
        });
      }
      timer = setTimeout(processVideoFrames, 100);
    };

    const main = async () => {
      try {
        // Wait for the video element to be ready
        await new Promise<void>((resolve) => {
          if (videoRef.current!.readyState >= 2) {
            resolve();
          } else {
            videoRef.current!.oncanplay = () => resolve();
          }
        });

        await initializeGestureRecognizer();
        await processVideoFrames();
      } catch (error) {
        console.log(error);
      }
    };
    main();
  }, []);
  console.log(gesture);
  return { gesture };
};

export { useGestureRecognition };
