import Camera from '@/components/Camera';
import { useGestureRecognition } from '@/hooks/GestureHooks';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { useRef } from 'react';
import { useParams } from 'react-router';

const DetectGesture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useGestureRecognition(videoRef);

  const { faceName } = useParams();
  const { gesture } = useGestureRecognition(videoRef);

  return (
    <>
      <section className='w-full'>
        <Camera ref={videoRef} width={800} aspect={16 / 9} />
      </section>
      <section className='w-full'>
        <div className='absolute top-24 left-0 p-4 bg-slate-900'>
          <p>
            faceName: {faceName} &nbsp;
            {gesture === 'Thumb_Up' && <ThumbsUpIcon className='inline' />}
            {gesture === 'Thumb_Down' && <ThumbsDownIcon className='inline' />}
          </p>
          {gesture ? <p>Point up to save</p> : <p>Thumb up or down to vote</p>}
        </div>
      </section>
    </>
  );
};

export default DetectGesture;
