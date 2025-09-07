'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface UseAutoScrollOptions {
  enabled?: boolean; // Allow toggling auto-scroll
  smooth?: boolean; // Smooth scrolling
  threshold?: number; // How close to the bottom before auto-scrolling
}

export function useAutoScroll(
  scrollContentContainerRef: RefObject<HTMLElement | null>,
  options: UseAutoScrollOptions = {}
) {
  const { enabled = true, smooth = true, threshold = 50 } = options;

  useEffect(() => {
    if (!enabled || !scrollContentContainerRef.current) return;

    const element = scrollContentContainerRef.current;

    function scrollToBottom() {
      const isNearBottom =
        element.scrollHeight - element.scrollTop - element.clientHeight <= threshold;

      if (isNearBottom) {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto',
        });
      }
    }

    const resizeObserver = new ResizeObserver(scrollToBottom);
    resizeObserver.observe(element);

    // Initial scroll
    scrollToBottom();

    return () => resizeObserver.disconnect();
  }, [scrollContentContainerRef, enabled, smooth, threshold]);
}

interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  autoScroll?: boolean;
  smoothScroll?: boolean;
}

export const ChatMessageView = ({
  className,
  children,
  autoScroll = true,
  smoothScroll = true,
  ...props
}: ChatProps) => {
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useAutoScroll(scrollContentRef, { enabled: autoScroll, smooth: smoothScroll });

  return (
    <div
      ref={scrollContentRef}
      className={cn('flex flex-col justify-end overflow-auto', className)}
      {...props}
    >
      {children}
    </div>
  );
};
