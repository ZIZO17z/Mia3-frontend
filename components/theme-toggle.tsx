// components/theme-toggle.tsx
'use client';

import { useEffect, useState } from 'react';
import { MonitorIcon, MoonIcon, SunIcon } from '@phosphor-icons/react';
import type { ThemeMode } from '@/lib/types';
import { THEME_MEDIA_QUERY, THEME_STORAGE_KEY, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const THEME_SCRIPT = `
  (function() {
    const doc = document.documentElement;
    const theme = localStorage.getItem("${THEME_STORAGE_KEY}") ?? "system";
    const prefersDark = window.matchMedia("${THEME_MEDIA_QUERY}").matches;

    doc.classList.remove('dark', 'light');
    
    if (theme === 'system') {
      doc.classList.add(prefersDark ? 'dark' : 'light');
      doc.setAttribute('data-theme', 'system');
    } else {
      doc.classList.add(theme);
      doc.setAttribute('data-theme', theme);
    }
    
    doc.setAttribute('data-theme-loaded', 'true');
  })();
`
  .trim()
  .replace(/\n/g, ' ')
  .replace(/\s+/g, ' ');

function applyTheme(theme: ThemeMode) {
  const doc = document.documentElement;
  const prefersDark = window.matchMedia(THEME_MEDIA_QUERY).matches;

  doc.classList.remove('dark', 'light');
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  if (theme === 'system') {
    doc.classList.add(prefersDark ? 'dark' : 'light');
    doc.setAttribute('data-theme', 'system');
  } else {
    doc.classList.add(theme);
    doc.setAttribute('data-theme', theme);
  }
  // Animate body background/text colors when theme changes
  doc.style.transition = 'background-color 0.5s ease, color 0.5s ease';
}

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabels?: boolean;
}

export function ApplyThemeScript() {
  return (
    <script
      id="theme-script"
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
      suppressHydrationWarning
    />
  );
}

export function ThemeToggle({
  className,
  variant = 'outline',
  size = 'default',
  showLabels = false,
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme =
      (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) ?? 'system';
    setTheme(storedTheme);
  }, []);

  const handleThemeChange = (newTheme: ThemeMode) => {
    applyTheme(newTheme);
    setTheme(newTheme);
  };

  const themes = [
    { value: 'dark' as const, icon: MoonIcon, label: 'Dark theme' },
    { value: 'light' as const, icon: SunIcon, label: 'Light theme' },
    { value: 'system' as const, icon: MonitorIcon, label: 'System theme' },
  ];

  if (!mounted) {
    // Skeleton state while mounting
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {themes.map(({ value, icon: Icon, label }) => (
          <Button
            key={value}
            variant={variant}
            size={size}
            disabled
            className="opacity-50"
            aria-label={label}
          >
            <Icon size={18} weight="bold" />
            {showLabels && <span className="ml-2">{label}</span>}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div
        className={cn('flex items-center gap-2', className)}
        role="group"
        aria-label="Theme toggle"
      >
        <span className="sr-only">Color scheme toggle</span>

        {themes.map(({ value, icon: Icon, label }) => (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <Button
                variant={theme === value ? 'default' : variant}
                size={size}
                onClick={() => handleThemeChange(value)}
                className={cn(
                  theme !== value && 'text-muted-foreground',
                  'relative transition-all duration-300 ease-in-out focus-visible:ring-2 focus-visible:ring-primary'
                )}
                aria-pressed={theme === value}
                aria-label={label}
              >
                <Icon
                  size={18}
                  weight="bold"
                  className={cn(
                    theme === value
                      ? 'scale-125 rotate-6 text-primary drop-shadow-glow'
                      : 'scale-100 opacity-75',
                    'transition-transform duration-300 ease-in-out'
                  )}
                />
                {showLabels && (
                  <span className="ml-2 text-xs font-medium">{label}</span>
                )}
                {/* subtle glow effect when active */}
                {theme === value && (
                  <span className="absolute inset-0 rounded-md ring-2 ring-primary/40 animate-pulse pointer-events-none" />
                )}
              </Button>
            </TooltipTrigger>
            {!showLabels && (
              <TooltipContent side="bottom" sideOffset={6}>
                <p>{label}</p>
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
