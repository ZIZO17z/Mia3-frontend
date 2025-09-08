'use client';

import { useEffect, useState } from 'react';
import App from '@/components/app';
import { APP_CONFIG_DEFAULTS } from '@/app-config';
import type { AppConfig } from '@/lib/types';

export default function HomePage() {
  const [appConfig, setAppConfig] = useState<AppConfig>(APP_CONFIG_DEFAULTS);

  useEffect(() => {
    // Load app config on client side to avoid SSR issues
    setAppConfig(APP_CONFIG_DEFAULTS);
  }, []);

  return <App appConfig={appConfig} />;
}
