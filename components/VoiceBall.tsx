// VoiceBall.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface VoiceBallProps extends HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
}

export default function VoiceBall({
  className = "",
  isActive = false,
  ...props
}: VoiceBallProps) {
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
    let animationFrame: number;
    let micStream: MediaStream | null = null;

    async function initMic() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(micStream);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 128;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        source.connect(analyser);

        const update = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(dataArray);

          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setAudioLevel(avg * 1.5);

          animationFrame = requestAnimationFrame(update);
        };

        update();
      } catch (err) {
        console.error('Microphone access denied or not available', err);
      }
    }

    initMic();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (audioContext) audioContext.close();
      if (micStream) micStream.getTracks().forEach(track => track.stop());
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
      `0 0 ${glow * 1.6}px rgba(160, 180, 255, 0.3)`
    ].join(', ');

    // Smooth aurora gradient for the ball
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
        'fixed inset-0 flex items-center justify-center z-50 pointer-events-none',
        className
      )}
      {...props}
    >
      <div
        ref={ballRef}
        className={cn(
          "relative z-50 flex items-center justify-center w-56 h-56 rounded-full transition-transform duration-100 ease-out",
          isActive ? "opacity-100" : "opacity-80"
        )}
      >
        <img
          src="/lk-logo.svg"
          alt="Logo"
          className="absolute left-1/2 top-1/2 w-28 h-28 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ zIndex: 60 }}
        />
      </div>

      {/* Soft Aura Layers */}
      <div className="absolute w-72 h-72 rounded-full bg-teal-400/20 blur-2xl animate-pulse-slow z-40" />
      <div className="absolute w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl animate-pulse-slower z-40" />
      <div className="absolute w-96 h-96 rounded-full bg-blue-300/10 blur-[100px] z-30" />

      {/* Gentle Pulsing Ring */}
      {isActive && (
        <div className="absolute inset-0 rounded-full border border-cyan-200/40 animate-ping z-40" />
      )}
    </div>
  );
}
