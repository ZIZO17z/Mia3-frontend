// welcome.tsx
import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WelcomeProps {
  disabled: boolean;
  startButtonText: string;
  onStartCall: () => void;
}

const WelcomeComponent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & WelcomeProps
>(({ disabled, startButtonText, onStartCall, className, ...props }, ref) => {
  return (
    <section
      ref={ref}
      inert={disabled ? true : undefined}
      className={cn(
        'bg-background fixed inset-0 mx-auto flex h-screen flex-col items-center justify-center px-4 text-center',
        disabled ? 'z-10 opacity-50' : 'z-20',
        className
      )}
      style={{ position: 'relative' }}
      {...props}
    >
      {/* ...existing code... (VoiceBall removed) */}

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-foreground mb-4 text-4xl font-bold md:text-5xl"
      >
        Let&apos;s start!
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-muted-foreground mb-8 max-w-2xl text-lg leading-8 md:text-xl"
      >
        Chat with your agent freely.
      </motion.p>

      {/* Start Session Button at the bottom */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="fixed bottom-20 left-0 z-30 flex w-full items-center justify-center"
      >
        <Button
          variant="primary"
          size="lg"
          onClick={onStartCall}
          disabled={disabled}
          className={cn(
            'w-56 rounded-lg border border-gray-300 bg-white px-8 py-3 text-base text-gray-800 shadow-md transition-colors duration-200 hover:bg-gray-100 focus:ring-2 focus:ring-blue-300 focus:outline-none md:w-64 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800',
            disabled ? 'cursor-not-allowed opacity-60' : ''
          )}
        >
          {startButtonText}
        </Button>
      </motion.div>
    </section>
  );
});

WelcomeComponent.displayName = 'WelcomeComponent';

export const Welcome = motion(WelcomeComponent);

Welcome.displayName = 'Welcome';
