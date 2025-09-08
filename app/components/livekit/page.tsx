'use client';

import { useEffect, useState } from 'react';
import { Participant, Track } from 'livekit-client';
import { useRoomContext } from '@livekit/components-react';
import { AgentControlBar } from '@/components/livekit/agent-control-bar/agent-control-bar';
import { DeviceSelect } from '@/components/livekit/device-select';
import { TrackToggle } from '@/components/livekit/track-toggle';
import { Container } from '../Container';

export default function LiveKit() {
  const room = useRoomContext();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const updateParticipants = () => {
      const allParticipants = [
        room.localParticipant,
        ...Array.from(room.remoteParticipants.values()),
      ];
      setParticipants(allParticipants);
    };

    updateParticipants();
    room.on('participantConnected', updateParticipants);
    room.on('participantDisconnected', updateParticipants);

    return () => {
      room.off('participantConnected', updateParticipants);
      room.off('participantDisconnected', updateParticipants);
    };
  }, [room]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-gradient-to-br from-[#0A0A2A] via-[#1C1C3D] to-[#3C1361] py-6">
      {/* Device Selection */}
      <Container className="glass mb-6 w-full max-w-5xl rounded-2xl border border-[#23234d]/30 p-6 shadow-lg backdrop-blur-md">
        <h3 className="mb-4 text-lg font-semibold text-[#E0F0FF]">Device Selection</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <DeviceSelect kind="audioinput" />
          <DeviceSelect kind="videoinput" />
        </div>
      </Container>

      {/* Track Controls */}
      <Container className="glass mb-6 w-full max-w-5xl rounded-2xl border border-[#23234d]/30 p-6 shadow-lg backdrop-blur-md">
        <h3 className="mb-4 text-lg font-semibold text-[#E0F0FF]">Track Controls</h3>
        <div className="flex flex-wrap gap-6">
          <TrackToggle variant="outline" source={Track.Source.Microphone} />
          <TrackToggle variant="outline" source={Track.Source.Camera} />
        </div>
      </Container>

      {/* Video Grid */}
      <Container className="glass mb-6 w-full max-w-7xl rounded-3xl border border-[#23234d]/30 p-6 shadow-2xl backdrop-blur-lg">
        <h3 className="mb-6 text-xl font-bold text-[#E0F0FF]">Video Call</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {participants.map((p) => (
            <div
              key={p.sid}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 shadow-xl transition-transform duration-300 ${activeVideo === p.sid ? 'z-50 scale-110 border-[#A8335E]/80 shadow-2xl' : 'scale-100 border-[#3C1361]/40'} bg-gradient-to-br from-[#23234d]/70 to-[#3C1361]/50`}
              onClick={() => setActiveVideo(activeVideo === p.sid ? null : p.sid)}
            >
              <video
                autoPlay
                playsInline
                muted={p.isLocal}
                className="h-64 w-full rounded-2xl object-cover transition-transform duration-300 sm:h-72 md:h-80 lg:h-96"
                ref={(el) => {
                  if (el) {
                    const videoTrackPub = p
                      .getTrackPublications()
                      .find((t) => t.track && t.track.kind === 'video');
                    if (videoTrackPub && videoTrackPub.track) {
                      videoTrackPub.track.attach(el);
                    }
                  }
                }}
              />
              {activeVideo === p.sid && (
                <div className="pointer-events-none absolute inset-0 animate-pulse rounded-2xl border-4 border-[#A8335E] shadow-[0_0_40px_#A8335E80]"></div>
              )}
              <div className="absolute right-2 bottom-2 left-2 flex items-center justify-between rounded-xl bg-black/50 px-3 py-1 text-xs text-[#E0F0FF] shadow-md">
                <span className="truncate font-semibold">{p.identity}</span>
                {p.isLocal && (
                  <span className="ml-2 rounded bg-[#A8335E]/80 px-2 py-0.5 text-[10px] text-white">
                    You
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Agent Control Bar */}
      <Container className="glass mb-8 w-full max-w-5xl rounded-2xl border border-[#23234d]/30 p-4 shadow-lg backdrop-blur-md">
        <AgentControlBar
          className="w-full"
          capabilities={{
            supportsChatInput: true,
            supportsVideoInput: true,
            supportsScreenShare: true,
          }}
        />
      </Container>
    </div>
  );
}
