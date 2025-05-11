import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;

export function ModalOverlay({ className = '', ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fadeIn',
        className
      )}
      {...props}
    />
  );
}

export const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-50 w-full max-w-lg sm:max-w-lg max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background shadow-2xl focus:outline-none animate-fadeIn',
        'max-h-[90vh] overflow-y-auto',
        'p-4 sm:p-8',
        className
      )}
      {...props}
    >
      <ModalClose className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </ModalClose>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
ModalContent.displayName = 'ModalContent';

export const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-2xl font-bold mb-2', className)}
    {...props}
  />
));
ModalTitle.displayName = 'ModalTitle';

export const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-base text-muted-foreground mb-4', className)}
    {...props}
  />
));
ModalDescription.displayName = 'ModalDescription'; 