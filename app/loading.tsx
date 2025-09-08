import VoiceBall from '@/components/VoiceBall';

export default function Loading() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center">
      <VoiceBall />
      <p className="text-foreground mt-6 text-lg font-medium">Loading...</p>
    </div>
  );
}
