// provider.tsx

'use client';

import React from 'react';
import { Room } from 'livekit-client';
import { RoomContext } from '@livekit/components-react';
import { toastAlert } from '@/components/alert-toast';
import useConnectionDetails from '@/hooks/useConnectionDetails';
import type { AppConfig } from '@/lib/types';

export function Provider({
  appConfig,
  children,
}: {
  appConfig: AppConfig;
  children: React.ReactNode;
}) {
  const { connectionDetails } = useConnectionDetails(appConfig);
  const room = React.useMemo(() => new Room(), []);

  React.useEffect(() => {
    if (room.state === 'disconnected' && connectionDetails) {
      const connectToRoom = async () => {
        try {
          await room.localParticipant.setMicrophoneEnabled(true, undefined, {
            preConnectBuffer: true,
          });

          await room.connect(connectionDetails.serverUrl, connectionDetails.participantToken);
        } catch (error) {
          console.error('Connection error:', error);
          toastAlert({
            title: 'Connection failed',
            description:
              error instanceof Error
                ? `${error.name}: ${error.message}`
                : 'Unknown error occurred while connecting to the agent',
          });
        }
      };

      connectToRoom();
    }

    return () => {
      if (room.state !== 'disconnected') {
        room.disconnect();
      }
    };
  }, [room, connectionDetails]);

  return <RoomContext.Provider value={room}>{children}</RoomContext.Provider>;
}
