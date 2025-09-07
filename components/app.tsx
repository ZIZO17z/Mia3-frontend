// app.tsx
'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Room, RoomEvent, LocalTrackPublication } from 'livekit-client';
import { motion, AnimatePresence } from 'motion/react';
import { RoomAudioRenderer, RoomContext, StartAudio, useRoomContext } from '@livekit/components-react';
import { toastAlert } from '@/components/alert-toast';
import { SessionView } from '@/components/session-view';
import { Toaster } from '@/components/ui/sonner';
import { Welcome } from '@/components/welcome';
import VoiceBall from '@/components/VoiceBall';
import useConnectionDetails from '@/hooks/useConnectionDetails';
import type { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

const MotionWelcome = motion(Welcome);
const MotionSessionView = motion(SessionView);

interface AppProps {
  appConfig: AppConfig;
}

export default function App({ appConfig }: AppProps) {
  const room = useMemo(() => new Room(), []);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [audioLevel, setAudioLevel] = useState(0);
  const { refreshConnectionDetails, existingOrRefreshConnectionDetails } =
    useConnectionDetails(appConfig);

  const startSession = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      const connectionDetails = await existingOrRefreshConnectionDetails();
      
      if (!connectionDetails) {
        throw new Error('Failed to get connection details');
      }

      await room.connect(connectionDetails.serverUrl, connectionDetails.participantToken);
      setSessionStarted(true);
    } catch (error) {
      console.error('Failed to start session:', error);
      setConnectionStatus('disconnected');
      toastAlert({
        title: 'Failed to start session',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }, [room, existingOrRefreshConnectionDetails]);

  const endSession = useCallback(() => {
    room.disconnect();
    setSessionStarted(false);
    setConnectionStatus('disconnected');
    refreshConnectionDetails();
  }, [room, refreshConnectionDetails]);

  useEffect(() => {
    const onDisconnected = () => {
      setSessionStarted(false);
      setConnectionStatus('disconnected');
      refreshConnectionDetails();
    };
    
    const onConnected = () => {
      setConnectionStatus('connected');
    };
    
    const onReconnecting = () => {
      setConnectionStatus('connecting');
    };
    
    const onMediaDevicesError = (error: Error) => {
      toastAlert({
        title: 'Media devices error',
        description: `${error.name}: ${error.message}`,
      });
    };

    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    room.on(RoomEvent.Disconnected, onDisconnected);
    room.on(RoomEvent.Connected, onConnected);
    room.on(RoomEvent.Reconnecting, onReconnecting);

    return () => {
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.Connected, onConnected);
      room.off(RoomEvent.Reconnecting, onReconnecting);
      room.disconnect();
    };
  }, [room, refreshConnectionDetails]);

  useEffect(() => {
    let audioLevelInterval: NodeJS.Timeout;
    
    if (connectionStatus === 'connected') {
      audioLevelInterval = setInterval(() => {
        const audioTracks = Array.from(room.localParticipant.audioTrackPublications.values());
        const activeTrack = audioTracks.find(track => track.track && track.track.mediaStreamTrack.enabled);
        
        if (activeTrack && activeTrack.track) {
          // Simulate audio level for visualization (in a real app, use actual audio levels)
          const simulatedLevel = Math.random() * 100;
          setAudioLevel(simulatedLevel);
        }
      }, 100);
    }

    return () => {
      if (audioLevelInterval) clearInterval(audioLevelInterval);
    };
  }, [connectionStatus, room]);

  return (
    <RoomContext.Provider value={room}>
      <div className="relative min-h-screen bg-background">
        <AnimatePresence mode="wait">
          {!sessionStarted ? (
            <MotionWelcome
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              disabled={connectionStatus === 'connecting'}
              startButtonText={
                connectionStatus === 'connecting' ? 'Connecting...' : 'Start Session'
              }
              onStartCall={startSession}
            />
          ) : (
            <MotionSessionView
              key="session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              appConfig={appConfig}
              disabled={false}
              sessionStarted={sessionStarted}
            />
          )}
        </AnimatePresence>

        {connectionStatus === 'connecting' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center">
              <VoiceBall className="mx-auto mb-6" />
              <p className="text-lg font-medium text-foreground">Connecting to session...</p>
            </div>
          </div>
        )}

        <RoomAudioRenderer />
        <StartAudio label="Click to allow audio playback" />
        <Toaster />
      </div>
    </RoomContext.Provider>
  );
}