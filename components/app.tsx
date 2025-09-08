// app.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';
import { AnimatePresence, motion } from 'motion/react';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import VoiceBall from '@/components/VoiceBall';
import { toastAlert } from '@/components/alert-toast';
import { SessionView } from '@/components/session-view';
import { Toaster } from '@/components/ui/sonner';
import { Welcome } from '@/components/welcome';
import useConnectionDetails from '@/hooks/useConnectionDetails';
import type { AppConfig } from '@/lib/types';

// app.tsx

const MotionWelcome = motion(Welcome);
const MotionSessionView = motion(SessionView);

interface AppProps {
  appConfig: AppConfig;
}

export default function App({ appConfig }: AppProps) {
  const room = useMemo(() => new Room(), []);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected'
  >('disconnected');
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

  return (
    <RoomContext.Provider value={room}>
      <div className="bg-background relative min-h-screen">
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
          <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <VoiceBall className="mx-auto mb-6" />
              <p className="text-foreground text-lg font-medium">Connecting to session...</p>
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
