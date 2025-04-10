'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Stage2() {
  const router = useRouter();
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  const onOptionSelected = (option: string) => {
    console.log(option)
    setIsOptionSelected(true)
    setTimeout(() => router.push('/stage-3'), 1500)
  };

  return (
    <main>
      <h1>🎈 Stage 2</h1>
      <p>Me gustan los ...</p>
      <button disabled={isOptionSelected} onClick={ ()=> onOptionSelected('dragón') }>... dragón</button>
      <button disabled={isOptionSelected} onClick={ ()=> onOptionSelected('cosoto') }>... cosoto</button>
      <button disabled={isOptionSelected} onClick={ ()=> onOptionSelected('plesioso') }>... plesioso</button>
    </main>
  );
}