'use client';

import { useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
  duration?: number;
}

export default function Toast({ message, type, onDismiss, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 text-sm font-semibold uppercase tracking-wider animate-bounce ${
        type === 'success'
          ? 'bg-primary-light text-primary border-primary/20'
          : 'bg-destructive/10 text-destructive border-destructive/20'
      }`}
    >
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span>{message}</span>
    </div>
  );
}