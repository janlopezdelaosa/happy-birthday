'use client'

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { structure } from '@/data/structure';
import { text } from 'stream/consumers';

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
  console.log({ frameNumber });
  const frameData = structure[frameNumber];
  console.log({ frameData });

  // ---
  const [password, setPassword] = useState('');
  const [isPasswordSubmited, setIsPasswordSubmited] = useState(false);
  // ---
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === frameData.password) {
      // setIsPasswordSubmited(true);
      setFeedback('😻');
      setTimeout(() => router.push('/1'), 1500)
    } else {
      setFeedback('Wrong password, try again!');
      setTimeout(() => {
        setFeedback('');
        setPassword('');
        setIsOptionSelected(false);
      }, 2000)
    }
  };

  const onOptionSelected = ({ text, isCorrect, answer }: { text: string, isCorrect: boolean, answer: string }) => {
    setIsOptionSelected(true)
    if (isCorrect) {
      setFeedback('😻');
      setTimeout(() => router.push(`/${frameNumber + 1}`), 1500)
    } else {
      setFeedback(answer);
      setTimeout(() => {
        setFeedback('');
        setIsOptionSelected(false);
      }, 3000)
    }
  };

  const isFirstFrame = frameNumber === 1
  const isLastFrame = frameNumber >= structure.length - 1

  const pushPrevFrame = () => !isFirstFrame && router.push(`/${frameNumber - 1}`)
  const pushNextFrame = () => router.push(`/${isLastFrame ? '/' : frameNumber + 1}`)

  const contain = frameData?.image?.contain ?? false;
  const textTop = frameData?.image?.top ?? 20;
  const textLeft = frameData?.image?.left ?? 17;
  const textWidth = frameData?.image?.width ?? 'full';
  const textRotate = frameData?.image?.rotate ?? '0';

  console.log({textTop, textLeft, textWidth})
  console.log(frameData.text)


  return (
    <main className='touch-none'>
      <p className='hidden -ml-30 w-3/4 mt-30 mt-100 ml-23 mt-90 ml-35 mt-93 mt-108 ml-45 mt-150 ml-90 mt-5 mt-2 ml-55 mt-155'></p>
      <div className='absolute inset-0 flex border-3 bg-black'>
        <img className={`${contain ? 'absolute' : '' } object-${contain ? 'contain' : 'cover' } `} src={`/photos/${frameNumber}.jpeg`} />
      </div>
      <div className='absolute inset-0 flex justify-center'>
        {
          frameData.password ?
            <>
              <h1 className='mt-10 text-center text-5xl font-bold'>HAPPY<br />BIRTHDAY</h1>
              {feedback && <h2 className='absolute bottom-57 text-black text-2xl drop-shadow-[0_1.5px_1.5px_rgba(250,250,250,1)]'>{feedback}</h2>}
              <form className='absolute bottom-20 flex flex-col items-center text-white text-2xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]' onSubmit={handleSubmit}>
                <label className='text-center'>{frameData.text}</label>
                <input className='text-center border my-4'
                  // type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className='border bg-zinc-200 rounded-xl w-fit text-black px-10' type="submit">Submit</button>
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

  // return (
  //   <main>
  //     <h1>🎈 Stage 1</h1>
  //     <p>Soy un ...</p>
  //     <button disabled={isOptionSelected} onClick={ ()=> onOptionSelected('dragón') }>... dragón</button>
  //     <button disabled={isOptionSelected} onClick={ ()=> onOptionSelected('cosoto') }>... cosoto</button>
  //     <button disabled={isOptionSelected} onClick={ ()=> onOptionSelected('plesioso') }>... plesioso</button>
  //   </main>
  // );
}

// .mt-20

// .mt-40

// .mt-54

// .mt-60

// .mt-75

// .mt-80