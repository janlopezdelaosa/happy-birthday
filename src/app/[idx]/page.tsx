'use client'

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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
  console.log({ frameNumber });
  const frameData = structure[frameNumber];
  console.log({ frameData });
  console.log({ StructureLength:  structure.length  });
 
  // ---
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  // ---
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === frameData.password) {
      setIsPasswordCorrect(true);
      setTimeout(() => router.push('/1'), 1500)
    } else {
      alert('Wrong password, try again!');
    }
  };

  const onOptionSelected = ({ text, isCorrect, answer }: { text: string, isCorrect: boolean, answer: string }) => {
    // setIsOptionSelected(true)
    if (isCorrect) {
      setTimeout(() => router.push(`/${frameNumber + 1}`), 1500)
    } else {
      console.log(answer)
    }
  };

  return (
    <main>
      <img src={`/photos/${frameNumber}.jpeg`} />
      {
        frameData.password ?
          <form onSubmit={handleSubmit}>
            <label>
              Introduce el password correcto para continuar:
              <input
                // type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit">Submit</button>
          </form>
          :
          <>
            <h1>{frameData.text}</h1>
            {
              frameData.options ?
                <>
                  <button disabled={isOptionSelected} onClick={() => onOptionSelected(frameData.options[0])}>{frameData.options[0].text}</button>
                  <button disabled={isOptionSelected} onClick={() => onOptionSelected(frameData.options[1])}>{frameData.options[1].text}</button>
                </>
                :
                <>
                  <button onClick={() => router.push(`/${frameNumber - 1}`)}>Prev</button>
                  {frameNumber < structure.length - 1
                    ?
                    <button onClick={() => router.push(`/${frameNumber + 1}`)}>Next</button>
                    :
                    <button onClick={() => router.push('/')}>Home</button>
                  }
                </>
            }
          </>
      }
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