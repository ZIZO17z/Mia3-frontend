// welcome.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface WelcomeProps {
  disabled: boolean;
  startButtonText: string;
  onStartCall: () => void;
}

export const Welcome = motion(
  React.forwardRef<HTMLDivElement, React.ComponentProps<'div'> & WelcomeProps>(
    ({ disabled, startButtonText, onStartCall, className, ...props }, ref) => {
      return (
        <section
          ref={ref}
          inert={disabled ? true : undefined}
          className={cn(
            'bg-background fixed inset-0 mx-auto flex h-screen flex-col items-center justify-center text-center px-4',
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
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Let's start!
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-muted-foreground max-w-2xl text-lg md:text-xl leading-8 mb-8"
          >
            Chat with your agent freely.
          </motion.p>

          {/* Start Session Button at the bottom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="fixed bottom-20 left-0 w-full flex items-center justify-center z-30"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={onStartCall}
              disabled={disabled}
              className={cn(
                "w-56 md:w-64 text-base py-3 px-8 rounded-lg border border-gray-300 dark:border-gray-700 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300",
                disabled ? "opacity-60 cursor-not-allowed" : ""
              )}
            >
              {startButtonText}
            </Button>
          </motion.div>

        </section>
      );
    }
  )
);

Welcome.displayName = 'Welcome';
