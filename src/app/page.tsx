'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation';


export default function Password() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const PASSWORD = 'COSOTO';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setIsPasswordCorrect(true);
      setTimeout(() => router.push('/stage-1'), 1500)
    } else {
      alert('Wrong password, try again!');
    }
  };

  if (isPasswordCorrect) {
    return <h2>🎉 Access Granted! Welcome to the Birthday Surprise 🎁</h2>;
  }

  return (
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
  );

}
