export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      <p className="mt-4 text-lg font-medium text-foreground">Loading...</p>
    </div>
  );
}
