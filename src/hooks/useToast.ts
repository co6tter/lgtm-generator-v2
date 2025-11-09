"use client";

import { useCallback, useState } from "react";
import type { ToastType } from "@/components/ui/Toast";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface UseToastResult {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
}

/**
 * Hook for managing toast notifications
 */
export function useToast(): UseToastResult {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 3000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const toast: ToastMessage = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);
    },
    [],
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    hideToast,
    clearToasts,
  };
}
