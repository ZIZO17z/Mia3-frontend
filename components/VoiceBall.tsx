// VoiceBall.tsx

'use client';

import { type HTMLAttributes, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface VoiceBallProps extends HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
}

export default function VoiceBall({ className = '', isActive = false, ...props }: VoiceBallProps) {
  const ballRef = useRef<HTMLDivElement>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array;

    async function initMic() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) return;

        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(micStream);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        source.connect(analyser);

        function update() {
          if (!analyser) return;
          analyser.getByteFrequencyData(dataArray as Uint8Array<ArrayBuffer>);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setAudioLevel(avg * 1.5);
          requestAnimationFrame(update);
        }

        update();
      } catch (err) {
        console.error('Microphone access denied or not available', err);
      }
    }

    initMic();

    return () => {
      if (audioContext) audioContext.close();
    };
  }, [isClient]);

  useEffect(() => {
    if (!ballRef.current) return;

    const scale = 1 + (audioLevel / 255) * 1.4;
    const glow = 20 + (audioLevel / 255) * 70;

    ballRef.current.style.transform = `scale(${scale})`;
    ballRef.current.style.boxShadow = [
      `0 0 ${glow}px rgba(0, 255, 200, 0.6)`,
      `0 0 ${glow * 1.2}px rgba(80, 200, 255, 0.4)`,
      `0 0 ${glow * 1.6}px rgba(160, 180, 255, 0.3)`,
    ].join(', ');

    ballRef.current.style.background = `radial-gradient(circle at center,
      #0D1B2A 0%,
      #1B263B 30%,
      #415A77 60%,
      #778DA9 85%,
      #E0E1DD 100%
    )`;
  }, [audioLevel]);

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-50 flex items-center justify-center',
        className
      )}
      {...props}
    >
      <div
        ref={ballRef}
        className={cn(
          'relative z-50 flex h-56 w-56 items-center justify-center rounded-full transition-transform duration-100 ease-out',
          isActive ? 'opacity-100' : 'opacity-80'
        )}
      >
        <Image
          src="/lk-logo.svg"
          alt="Logo"
          width={112}
          height={112}
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
          style={{ zIndex: 60 }}
        />
      </div>

      {/* Soft Aura Layers */}
      <div className="animate-pulse-slow absolute z-40 h-72 w-72 rounded-full bg-teal-400/20 blur-2xl" />
      <div className="animate-pulse-slower absolute z-40 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="absolute z-30 h-96 w-96 rounded-full bg-blue-300/10 blur-[100px]" />

      {/* Gentle Pulsing Ring */}
      {isActive && (
        <div className="absolute inset-0 z-40 animate-ping rounded-full border border-cyan-200/40" />
      )}
    </div>
  );
}
