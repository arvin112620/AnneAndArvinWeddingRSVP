'use client';

import { useEffect, useState } from 'react';

const weddingDate = new Date('2026-11-26T16:00:00+08:00').getTime();

type Remaining = { days: number; hours: number; minutes: number; seconds: number };
const labels: Array<keyof Remaining> = ['days', 'hours', 'minutes', 'seconds'];
function getRemaining() {
  const difference = Math.max(weddingDate - Date.now(), 0);
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function Countdown() {
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  useEffect(() => {
    setRemaining(getRemaining());
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-5 sm:gap-8" aria-label="Countdown to the wedding">
      {labels.map((label) => (
        <div key={label} className="min-w-[45px] text-center">
          <div className="font-display text-3xl leading-none sm:text-4xl">{remaining ? String(remaining[label]).padStart(2, '0') : '--'}</div>
          <div className="mt-2 text-[10px] uppercase tracking-[.18em] text-white/65">{label}</div>
        </div>
      ))}
    </div>
  );
}
