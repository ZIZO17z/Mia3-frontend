import { headers } from 'next/headers';
import App from '@/components/app';
import { getAppConfig } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const hdrs = await headers();
  const appConfig = await getAppConfig(hdrs);

  return <App appConfig={appConfig} />;
}
