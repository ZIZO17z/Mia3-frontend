'use client';

import * as React from 'react';
import { Tabs } from '@/app/components/Tabs';
import { Provider } from '@/components/provider';
import type { AppConfig } from '@/lib/types';

interface ClientWrapperProps {
  appConfig: AppConfig;
  children: React.ReactNode;
}

export function ClientWrapper({ appConfig, children }: ClientWrapperProps) {
  return (
    <>
      <Tabs />
      <Provider appConfig={appConfig}>
        <main className="flex w-full flex-1 flex-col items-stretch gap-8">{children}</main>
      </Provider>
    </>
  );
}
