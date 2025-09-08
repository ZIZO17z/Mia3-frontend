// lib/types.ts
export interface AppConfig {
  supportsChatInput: boolean;
  supportsVideoInput: boolean;
  supportsScreenShare: boolean;
  isPreConnectBufferEnabled: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ConnectionDetails {
  serverUrl: string;
  participantToken: string;
}

export interface ToastProps {
  id: string | number;
  title: React.ReactNode;
  description: React.ReactNode;
}
