'use client'

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { structure } from '@/data/structure';

const useFrameNumberFromPathname = (): number => {
  const pathname = usePathname();                    // "/0", "/2", ...
  const frameNumberAsString = pathname.substring(1); // "0", "2", ...
  try {
    const frameNumber = Number(frameNumberAsString); // 0, 2, ...

    if (frameNumber < 0) {
      return 0;
    }

    if (frameNumber >= structure.length) {
      return 0;
    }

    return frameNumber;
  } catch {
    return 0;
  }
}

export default function Stage1() {
  const router = useRouter();
  const frameNumber = useFrameNumberFromPathname();
  const frameData = structure[frameNumber];

  // ---
  const [password, setPassword] = useState('');
  // ---
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [feedback, setFeedback] = useState('');

  const wrongPasswordFeedbacks = [
    '¿Cómo se te ocurre eso?, ¡marichocho!', '*mordisco*', 'Dedícate a otra cosa y ráscame', '😱'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === frameData.password) {
      setFeedback('😻');
      setTimeout(() => router.push('/1'), 1500)
    } else {
      setFeedback(wrongPasswordFeedbacks[Math.floor(Math.random() * wrongPasswordFeedbacks.length)]);
      setTimeout(() => {
        setFeedback('');
        setPassword('');
        setIsOptionSelected(false);
      }, 1500)
    }
  };

  const onOptionSelected = ({ text, isCorrect, answer }: { text: string, isCorrect: boolean, answer: string }) => {
    setIsOptionSelected(true)
    if (isCorrect) {
      setFeedback('😻');
      setTimeout(() => router.push(`/${frameNumber + 1}`), 1000)
    } else {
      setFeedback(answer);
      setTimeout(() => {
        setFeedback('');
        setIsOptionSelected(false);
      }, 1500)
    }
  };

  const isFirstFrame = frameNumber === 1
  const isLastFrame = frameNumber >= structure.length - 1

  const [hasFinishedGame, setHasFinishedGame] = useState(false);

  useEffect(() => {
    setHasFinishedGame(localStorage.getItem('gameFinished') === 'true');
  }, []);

  const back = () => router.push(`/${frameNumber === 0 ? structure.length - 1 : frameNumber - 1}`)
  const pushPrevFrame = () => !isFirstFrame && router.push(`/${frameNumber - 1}`)
  const pushNextFrame = () => {
    router.push(`/${isLastFrame ? '/' : frameNumber + 1}`)
    if (isLastFrame) {
      localStorage.setItem('gameFinished', 'true');
    }
  }

  const contain = frameData?.image?.contain ?? false;
  const textTop = frameData?.image?.top ?? 20;
  const textLeft = frameData?.image?.left ?? 17;
  const textWidth = frameData?.image?.width ?? 'full';
  const textRotate = frameData?.image?.rotate ?? '0';


  return (
    <main className='touch-none'>
      <p className='hidden -ml-30 w-3/4 mt-30 mt-100 ml-23 mt-90 ml-35 mt-93 mt-108 ml-45 mt-150 ml-90 mt-5 mt-2 ml-55 mt-155'></p>
      {hasFinishedGame &&
        <button className='absolute top-3 left-3 z-1' onClick={back}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-14 drop-shadow-[0_1.5px_1.5px_rgba(254,254,254,1)]">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
      }
      <div className='absolute inset-0 flex border-3 bg-black'>
        <img className={`${contain ? 'absolute' : ''} object-${contain ? 'contain' : 'cover'} `} src={`/photos/${frameNumber}.jpeg`} />
      </div>
      <div className='absolute inset-0 flex justify-center'>
        {
          frameData.password ?
            <>
              <h1 className='mt-10 text-center text-5xl font-bold'>HAPPY<br />BIRTHDAY</h1>
              {feedback && <h2 className='absolute bottom-57 text-black text-2xl text-center drop-shadow-[0_1.5px_1.5px_rgba(250,250,250,1)]'>{feedback}</h2>}
              <form className='absolute bottom-20 flex flex-col items-center text-white text-2xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]' onSubmit={handleSubmit}>
                <label className='text-center'>{frameData.text}</label>
                <input className='text-center border my-4'
                  // type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className='border bg-zinc-200 rounded-xl w-fit text-black px-10' type="submit">Entrar</button>
              </form>
            </>

            :
            <>
              <h1 className={`mt-${textTop} ${textLeft < 0 ? `-ml-${Math.abs(textLeft)}` : `ml-${textLeft}`} w-${textWidth} rotate-${textRotate} text-center text-white text-3xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] whitespace-break-spaces `}>{frameData.text}</h1>
              {
                frameData.options ?
                  <>
                    {isOptionSelected && <h2 className='absolute bottom-17 text-black text-2xl drop-shadow-[0_1.5px_1.5px_rgba(250,250,250,1)]'>{feedback}</h2>}
                    <div className='absolute bottom-30 w-full flex justify-evenly'>
                      <button className='w-1/2 h-full border bg-zinc-200 rounded-xl w-fit text-black text-xl px-7 py-3' disabled={isOptionSelected} onClick={() => onOptionSelected(frameData.options[0])}>{frameData.options[0].text}</button>
                      <button className='w-1/2 h-full border bg-zinc-200 rounded-xl w-fit text-black text-xl px-7 py-3' disabled={isOptionSelected} onClick={() => onOptionSelected(frameData.options[1])}>{frameData.options[1].text}</button>
                    </div>
                  </>
                  :
                  <div className='absolute inset-0'>
                    <button className='w-1/2 h-full' onClick={pushPrevFrame}>{isFirstFrame ? '' : ''}</button>
                    <button className='w-1/2 h-full' onClick={pushNextFrame}>{isLastFrame ? 'Home' : ''}</button>
                  </div>
              }
            </>
        }
      </div>
    </main>
  );
}