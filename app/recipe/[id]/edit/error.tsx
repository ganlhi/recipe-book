'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-[calc(100vh-64px-48px)] w-full flex items-center justify-center flex-col gap-3">
      <h2>Erreur lors de la modification 😞</h2>
      <button className="btn" onClick={() => reset()}>
        Réessayer
      </button>
    </div>
  );
}
