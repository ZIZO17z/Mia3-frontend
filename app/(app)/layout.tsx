import { headers } from 'next/headers';
import Image from 'next/image';
import VoiceBall from '@/components/VoiceBall';
import { getAppConfig } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const hdrs = await headers();
  await getAppConfig(hdrs);

  return (
    <>
      <header className="backdrop-blur-glass fixed top-0 left-0 z-50 flex w-full flex-row justify-between p-6">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.facebook.com/ziad.salem.147144"
          className="glass scale-100 rounded-full border border-gray-200 p-2 shadow-lg transition-transform duration-300 hover:scale-105 dark:border-gray-700"
        >
          <Image
            src="/Ziad_image.png"
            alt="Ziad Emad"
            width={40}
            height={40}
            className="block rounded-full object-cover"
          />
        </a>
        <span className="text-foreground glass flex items-center rounded-full px-4 py-2 font-mono text-xs font-bold tracking-wider uppercase">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/ziad-emad-2b372035b/"
            className="gradient-text ml-1 underline underline-offset-4"
          >
            Made by: Ziad Emad
          </a>
        </span>
      </header>

      <main className="animated-background relative flex min-h-screen flex-col items-center pt-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-primary/10 animate-pulse-slow absolute -top-40 -left-40 h-80 w-80 rounded-full blur-3xl"></div>
          <div className="bg-accent/10 animate-pulse-slower absolute top-1/4 -right-40 h-96 w-96 rounded-full blur-3xl"></div>
          <div className="bg-secondary/10 animate-pulse-slow absolute bottom-0 left-1/4 h-72 w-72 rounded-full blur-3xl"></div>
        </div>

        <VoiceBall className="z-10 mb-8" />

        <div className="z-10 w-full max-w-4xl px-4">{children}</div>
      </main>
    </>
  );
}
