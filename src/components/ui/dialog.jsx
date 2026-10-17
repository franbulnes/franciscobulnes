import { forwardRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

// The Radix primitives and state-driven fade/zoom pattern used by shadcn Dialog,
// styled locally so the site can keep its existing CSS and light palette.
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export const DialogContent = forwardRef(function DialogContent({ children, className = '', ...props }, ref) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay" />
      <DialogPrimitive.Content ref={ref} className={`entry-dialog ${className}`} {...props}>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
