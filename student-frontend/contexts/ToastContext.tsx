'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import Toast from '@/components/ui/Toast';

/* ── Types ── */
export type ToastType = 'success' | 'error';

interface ToastContextValue {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  dismissToast: () => void;
}

/* ── Context ── */
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = useCallback(() => {
    setToast(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType, duration = 4000) => {
      // Dismiss any active toast first
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setToast({ message, type });
      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, duration);
    },
    []
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const value: ToastContextValue = { showToast, dismissToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={dismissToast}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>.');
  }
  return ctx;
}