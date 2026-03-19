import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        success:
          "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
        error:
          "border-destructive/50 bg-destructive text-destructive-foreground",
        warning:
          "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type ToastVariant = "default" | "success" | "error" | "warning";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastItemProps extends VariantProps<typeof toastVariants> {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  return (
    <div
      className={cn(
        toastVariants({ variant: toast.variant }),
        "animate-in slide-in-from-right-full"
      )}
      role="alert"
    >
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className={cn(
          "rounded-md p-1 opacity-70 transition-opacity hover:opacity-100",
          "focus:outline-none focus:ring-1 focus:ring-ring"
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex flex-col gap-2",
        "w-full max-w-sm pointer-events-none"
      )}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

// Toast context and provider
interface ToastContextValue {
  toasts: Toast[];
  toast: (message: string, variant?: ToastVariant) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_TIMEOUT = 5000;

interface ToastProviderProps {
  children: React.ReactNode;
  /** Auto-dismiss timeout in ms (default: 5000) */
  timeout?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  timeout = DEFAULT_TIMEOUT,
}) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  const toast = React.useCallback(
    (message: string, variant: ToastVariant = "default") => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: Toast = { id, message, variant };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss after timeout
      setTimeout(() => {
        dismiss(id);
      }, timeout);
    },
    [dismiss, timeout]
  );

  const value = React.useMemo(
    () => ({ toasts, toast, dismiss, dismissAll }),
    [toasts, toast, dismiss, dismissAll]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Standalone toast hook that manages its own state (for simpler usage without provider)
export function useStandaloneToast(timeout: number = DEFAULT_TIMEOUT) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (message: string, variant: ToastVariant = "default") => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: Toast = { id, message, variant };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        dismiss(id);
      }, timeout);

      return id;
    },
    [dismiss, timeout]
  );

  const ToastRenderer = React.useCallback(
    () => <ToastContainer toasts={toasts} onDismiss={dismiss} />,
    [toasts, dismiss]
  );

  return { toast, dismiss, ToastRenderer };
}

export { ToastContainer, ToastItem, toastVariants };
