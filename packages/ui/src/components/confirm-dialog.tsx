import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"

interface ConfirmDialogProps {
  title: React.ReactNode
  description?: React.ReactNode
  cancelLabel?: string
  success?: string
  destructive?: string
  onSuccess?: () => void
  onDestructive?: () => void
  onCancel?: () => void
  children: React.ReactNode
}

function ConfirmDialog({
  title,
  description,
  cancelLabel = "Cancel",
  success = "Confirm",
  destructive,
  onSuccess,
  onDestructive,
  onCancel,
  children,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
          {onSuccess && (
            <AlertDialogAction onClick={onSuccess}>{success}</AlertDialogAction>
          )}
          {destructive && (
            <AlertDialogAction variant="destructive" onClick={onDestructive}>
              {destructive}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ConfirmDialog }
export type { ConfirmDialogProps }
