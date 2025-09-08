import { NextResponse } from 'next/server';
import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';
import { RoomConfiguration } from '@livekit/protocol';

// NOTE: you are expected to define the following environment variables in `.env.local`:
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

// don't cache the results
export const revalidate = 0;

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

export async function POST(req: Request) {
  try {
    // Validate environment variables
    if (!LIVEKIT_URL) {
      console.error('Missing LIVEKIT_URL environment variable');
      return new NextResponse('Server configuration error: Missing LIVEKIT_URL', { status: 500 });
    }
    if (!API_KEY) {
      console.error('Missing LIVEKIT_API_KEY environment variable');
      return new NextResponse('Server configuration error: Missing LIVEKIT_API_KEY', {
        status: 500,
      });
    }
    if (!API_SECRET) {
      console.error('Missing LIVEKIT_API_SECRET environment variable');
      return new NextResponse('Server configuration error: Missing LIVEKIT_API_SECRET', {
        status: 500,
      });
    }

    // Parse agent configuration from request body with error handling
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Invalid JSON in request body:', parseError);
      return new NextResponse('Invalid request body', { status: 400 });
    }

    const agentName: string = body?.room_config?.agents?.[0]?.agent_name;

    // Generate participant token
    const participantName = 'user';
    const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`;
    const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;

    const participantToken = await createParticipantToken(
      { identity: participantIdentity, name: participantName },
      roomName,
      agentName
    );

    // Return connection details
    const data: ConnectionDetails = {
      serverUrl: LIVEKIT_URL,
      roomName,
      participantToken: participantToken,
      participantName,
    };
    const headers = new Headers({
      'Cache-Control': 'no-store',
    });
    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error('Connection details API error:', error);

    if (error instanceof Error) {
      // Don't expose internal error details in production
      const errorMessage =
        process.env.NODE_ENV === 'development' ? error.message : 'Internal server error';
      return new NextResponse(errorMessage, { status: 500 });
    }

    return new NextResponse('Unknown server error', { status: 500 });
  }
}

function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  agentName?: string
): Promise<string> {
  const at = new AccessToken(API_KEY, API_SECRET, {
    ...userInfo,
    ttl: '15m',
  });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);

  if (agentName) {
    at.roomConfig = new RoomConfiguration({
      agents: [{ agentName }],
    });
  }

  return at.toJwt();
}
