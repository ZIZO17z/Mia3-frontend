import { useState, useEffect } from 'react';
import { Participant, Room, Track } from 'livekit-client';
import { AgentControlBar } from '@/components/livekit/agent-control-bar/agent-control-bar';
import { DeviceSelect } from '@/components/livekit/device-select';
import { TrackToggle } from '@/components/livekit/track-toggle';
import { Container } from '../Container';

interface LiveKitProps {
  room: Room;
}

export default function LiveKit({ room }: LiveKitProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const updateParticipants = () => {
      const allParticipants = [room.localParticipant, ...Array.from(room.remoteParticipants.values())];
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
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-[#0A0A2A] via-[#1C1C3D] to-[#3C1361] py-6">
      {/* Device Selection */}
      <Container className="max-w-5xl w-full mb-6 glass rounded-2xl shadow-lg border border-[#23234d]/30 backdrop-blur-md p-6">
        <h3 className="text-[#E0F0FF] text-lg font-semibold mb-4">Device Selection</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DeviceSelect kind="audioinput" />
          <DeviceSelect kind="videoinput" />
        </div>
      </Container>

      {/* Track Toggles */}
      <Container className="max-w-5xl w-full mb-6 glass rounded-2xl shadow-lg border border-[#23234d]/30 backdrop-blur-md p-6">
        <h3 className="text-[#E0F0FF] text-lg font-semibold mb-4">Track Controls</h3>
        <div className="flex gap-6 flex-wrap">
          <TrackToggle variant="outline" source={Track.Source.Microphone} />
          <TrackToggle variant="outline" source={Track.Source.Camera} />
        </div>
      </Container>

      {/* Video Grid */}
      <Container className="max-w-7xl w-full mb-6 glass rounded-3xl shadow-2xl border border-[#23234d]/30 backdrop-blur-lg p-6">
        <h3 className="text-[#E0F0FF] text-xl font-bold mb-6">Video Call</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {participants.map((p) => (
            <div
              key={p.sid}
              className={`relative group rounded-2xl overflow-hidden shadow-xl border-2 transition-transform duration-300 cursor-pointer
                ${activeVideo === p.sid ? 'scale-110 border-[#A8335E]/80 z-50 shadow-2xl' : 'scale-100 border-[#3C1361]/40'}
                bg-gradient-to-br from-[#23234d]/70 to-[#3C1361]/50`}
              onClick={() => setActiveVideo(activeVideo === p.sid ? null : p.sid)}
            >
              <video
                autoPlay
                playsInline
                muted={p.isLocal}
                className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover rounded-2xl transition-transform duration-300"
                ref={(el) => {
                  if (el) {
                    const videoTrackPub = p.getTrackPublications().find(
                      (t) => t.track && t.track.kind === 'video'
                    );
                    if (videoTrackPub && videoTrackPub.track) {
                      videoTrackPub.track.attach(el);
                    }
                  }
                }}
              />
              {/* Active Overlay */}
              {activeVideo === p.sid && (
                <div className="absolute inset-0 border-4 border-[#A8335E] rounded-2xl shadow-[0_0_40px_#A8335E80] animate-pulse pointer-events-none"></div>
              )}
              {/* Participant Info */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/50 px-3 py-1 rounded-xl text-xs text-[#E0F0FF] shadow-md">
                <span className="font-semibold truncate">{p.identity}</span>
                {p.isLocal && (
                  <span className="ml-2 px-2 py-0.5 rounded bg-[#A8335E]/80 text-white text-[10px]">You</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Agent Control Bar */}
      <Container className="max-w-5xl w-full mb-8 glass rounded-2xl shadow-lg border border-[#23234d]/30 backdrop-blur-md p-4">
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
