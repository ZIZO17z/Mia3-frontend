import { headers } from "next/headers";
import { getAppConfig } from "@/lib/utils";
import VoiceBall from "@/components/VoiceBall";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const hdrs = await headers();
  const { companyName, logo, logoDark } = await getAppConfig(hdrs);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full flex flex-row justify-between p-6 backdrop-blur-glass">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.facebook.com/ziad.salem.147144"
          className="scale-100 transition-transform duration-300 hover:scale-105 glass rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <img
            src="/Ziad_image.png"
            alt="Ziad Emad"
            className="block rounded-full object-cover"
            style={{ width: 40, height: 40, minWidth: 40, minHeight: 40, maxWidth: 48, maxHeight: 48 }}
          />
        </a>
        <span className="text-foreground font-mono text-xs font-bold tracking-wider uppercase glass rounded-full px-4 py-2 flex items-center">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/ziad-emad-2b372035b/"
            className="underline underline-offset-4 ml-1 gradient-text"
          >
            Made by: Ziad Emad
          </a>
        </span>
      </header>

      <main className="min-h-screen pt-24 relative flex flex-col items-center animated-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/4 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slower"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        
        <VoiceBall className="mb-8 z-10" />
        
        <div className="w-full max-w-4xl px-4 z-10">
          {children}
        </div>
      </main>
    </>
  );
}