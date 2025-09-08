'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  type AgentState,
  type ReceivedChatMessage,
  useRoomContext,
  useVoiceAssistant,
} from '@livekit/components-react';
import { toastAlert } from '@/components/alert-toast';
import { AgentControlBar } from '@/components/livekit/agent-control-bar/agent-control-bar';
import { ChatEntry } from '@/components/livekit/chat/chat-entry';
import { ChatMessageView } from '@/components/livekit/chat/chat-message-view';
import { MediaTiles } from '@/components/livekit/media-tiles';
import useChatAndTranscription from '@/hooks/useChatAndTranscription';
import { useDebugMode } from '@/hooks/useDebug';
import type { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

function isAgentAvailable(agentState: AgentState) {
  return ['listening', 'thinking', 'speaking'].includes(agentState);
}

interface SessionViewProps {
  appConfig: AppConfig;
  disabled: boolean;
  sessionStarted: boolean;
}

export const SessionView = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & SessionViewProps
>(({ appConfig, disabled, sessionStarted, className, ...props }, ref) => {
  const { state: agentState } = useVoiceAssistant();
  const [chatOpen, setChatOpen] = useState(false);
  const { messages, send } = useChatAndTranscription();
  const room = useRoomContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  useDebugMode({
    enabled: process.env.NODE_ENV !== 'production',
  });

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;
      try {
        await send(message);
      } catch (error) {
        console.error('Failed to send message:', error);
        toastAlert({
          title: 'Message failed',
          description: 'Could not send your message. Please try again.',
        });
      }
    },
    [send]
  );

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Session timeout check
  useEffect(() => {
    if (sessionStarted) {
      const timeout = setTimeout(() => {
        if (!isAgentAvailable(agentState)) {
          const reason =
            agentState === 'connecting'
              ? 'Agent did not join the room.'
              : 'Agent connected but did not initialize.';

          toastAlert({
            title: 'Session ended',
            description: reason,
          });
          room.disconnect();
        }
      }, 20_000);

      return () => clearTimeout(timeout);
    }
  }, [agentState, sessionStarted, room]);

  const { supportsChatInput, supportsVideoInput, supportsScreenShare } = appConfig;
  const capabilities = { supportsChatInput, supportsVideoInput, supportsScreenShare };

  return (
    <section
      ref={ref}
      inert={disabled ? true : undefined}
      className={cn(
        'bg-background relative min-h-screen',
        disabled && 'pointer-events-none opacity-50',
        !chatOpen && 'max-h-screen overflow-hidden',
        className
      )}
      {...props}
    >
      {/* Chat messages */}
      <ChatMessageView
        className={cn(
          'mx-auto min-h-screen w-full max-w-2xl px-4 pt-32 pb-40 transition-all duration-300 ease-out md:px-6 md:pt-36 md:pb-48',
          chatOpen ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-20 opacity-0'
        )}
      >
        <div className="space-y-4 whitespace-pre-wrap" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {messages.map((message: ReceivedChatMessage, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  duration: 0.35,
                  ease: 'easeOut',
                  delay: idx * 0.05,
                }}
                layout
              >
                <ChatEntry hideName entry={message} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              className="text-muted-foreground py-12 text-center"
              role="status"
            >
              {sessionStarted ? (
                <p>👋 Start a conversation with your AI agent</p>
              ) : (
                <p>Waiting for session to start…</p>
              )}
            </motion.div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={scrollRef} />
        </div>
      </ChatMessageView>

      {/* Top gradient overlay */}
      <div className="bg-background fixed top-0 right-0 left-0 z-10 h-32 md:h-36">
        <div className="from-background absolute bottom-0 left-0 h-12 w-full translate-y-full bg-gradient-to-b to-transparent" />
      </div>

      {/* Media tiles (video/voice) */}
      <MediaTiles chatOpen={chatOpen} />

      {/* Control bar */}
      <div className="bg-background fixed right-0 bottom-0 left-0 z-50 px-4 pt-2 pb-4 md:px-12 md:pb-12">
        <motion.div
          key="control-bar"
          initial={{ opacity: 0, y: '100%' }}
          animate={{
            opacity: sessionStarted ? 1 : 0,
            y: sessionStarted ? '0%' : '100%',
          }}
          transition={{
            duration: 0.4,
            delay: sessionStarted ? 0.5 : 0,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="relative z-10 mx-auto w-full max-w-2xl">
            {appConfig.isPreConnectBufferEnabled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: sessionStarted && messages.length === 0 ? 1 : 0,
                  transition: {
                    ease: 'easeInOut',
                    delay: messages.length > 0 ? 0 : 0.8,
                    duration: messages.length > 0 ? 0.2 : 0.5,
                  },
                }}
                aria-hidden={messages.length > 0}
                className={cn(
                  'absolute inset-x-0 -top-12 text-center',
                  sessionStarted && messages.length === 0 && 'pointer-events-none'
                )}
              >
                <p className="animate-text-shimmer inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-sm font-semibold text-transparent">
                  Agent is listening, ask it a question…
                </p>
              </motion.div>
            )}

            <AgentControlBar
              capabilities={capabilities}
              onChatOpenChange={setChatOpen}
              onSendMessage={handleSendMessage}
            />
          </div>

          {/* Bottom gradient overlay */}
          <div className="from-background border-background absolute top-0 left-0 h-12 w-full -translate-y-full bg-gradient-to-t to-transparent" />
        </motion.div>
      </div>
    </section>
  );
});

SessionView.displayName = 'SessionView';
