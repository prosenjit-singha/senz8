"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";

type MaybeAsyncFn = () => unknown | Promise<unknown>;

interface ConfirmationAlertProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onConfirm?: MaybeAsyncFn;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  confirmationText?: string;
  processingText?: string;
  closeText?: string;
}

export const ConfirmationAlert = ({
  children,
  onConfirm,
  title = "Are you sure",
  description = "Are you absolutely sure?",
  open: propsOpen,
  confirmationText = "Yes",
  processingText = "Processing...",
  closeText = "No",
  onOpenChange: propsOnOpenChange,
}: ConfirmationAlertProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const isControlled = propsOpen !== undefined;
  const actualOpen = isControlled ? propsOpen : open;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      if (typeof onConfirm === "function") {
        await onConfirm();
      }
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog
      open={actualOpen}
      onOpenChange={(state: boolean) => {
        if (!isControlled) setOpen(state);
        propsOnOpenChange?.(state);
      }}
    >
      {!!children && (
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => {
              if (!isControlled) setOpen(false);
              propsOnOpenChange?.(false);
            }}
          >
            {closeText}
          </Button>
          {typeof onConfirm === "function" && (
            <Button onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? processingText : confirmationText}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationAlert;
