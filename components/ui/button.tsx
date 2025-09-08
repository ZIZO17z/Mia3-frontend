// button.tsx (fully enhanced)
import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 shrink-0 rounded-xl cursor-pointer outline-none transition-all duration-300',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:opacity-50 disabled:scale-100',
    'aria-invalid:ring-destructive/20 aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    'transform active:scale-95 hover:scale-105 transition-transform',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-button text-button-foreground shadow-sm hover:bg-button/90',
          'hover:shadow-md focus:bg-button/80',
        ],
        destructive: [
          'bg-destructive text-destructive-foreground shadow-sm',
          'hover:bg-destructive/90 focus:bg-destructive/80',
          'hover:shadow-md focus-visible:ring-destructive-foreground/20',
          'dark:focus-visible:ring-destructive-foreground/40',
        ],
        outline: [
          'border border-input bg-background shadow-sm',
          'hover:bg-accent hover:text-accent-foreground hover:shadow-md',
          'dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        ],
        primary: [
          'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg rounded-xl',
          'hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl focus:bg-blue-700',
          'transition-all duration-300 ease-in-out transform active:scale-95 hover:scale-105',
          'backdrop-blur-sm [&_svg]:transition-transform [&_svg]:group-hover:translate-x-1',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground shadow-sm rounded-lg',
          'hover:bg-secondary/80 focus:bg-secondary/70 hover:shadow-md',
        ],
        ghost: ['hover:bg-accent hover:text-accent-foreground', 'dark:hover:bg-accent/50'],
        link: ['text-primary underline-offset-4 hover:underline'],
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm font-semibold has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 text-xs font-medium has-[>svg]:px-2.5',
        lg: 'h-12 px-6 text-base font-bold has-[>svg]:px-4',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
