// components/theme-toggle.tsx

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { ThemeMode } from '@/lib/types';
import { THEME_MEDIA_QUERY, THEME_STORAGE_KEY, cn } from '@/lib/utils';

// components/theme-toggle.tsx

// components/theme-toggle.tsx

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
}: Omit<ThemeToggleProps, 'showLabels'>) {
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) ?? 'system';
    setTheme(storedTheme);
  }, []);

  const handleThemeChange = (newTheme: ThemeMode) => {
    applyTheme(newTheme);
    setTheme(newTheme);
  };

  if (!mounted) {
    return <div className={cn('opacity-50', className)} />;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant={variant}
        size={size}
        onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </Button>
    </div>
  );
}
