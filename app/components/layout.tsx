import * as React from 'react';
import { headers } from 'next/headers';
import { ClientWrapper } from '@/app/components/ClientWrapper';
import { getAppConfig } from '@/lib/utils';

export default async function ComponentsLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const appConfig = await getAppConfig(hdrs);
  return (
    <div className="mx-auto min-h-svh max-w-3xl space-y-8 px-4 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Quick Start UI overview</h1>
        <p className="text-muted-foreground">
          A quick start UI overview for the LiveKit Voice Assistant.
        </p>
      </header>
      <ClientWrapper appConfig={appConfig}>{children}</ClientWrapper>
    </div>
  );
}
