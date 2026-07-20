'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorDisplay({ title = 'Connection Error', message, onRetry, retryLabel = 'Retry' }: ErrorDisplayProps) {
  return (
    <div className="p-8 bg-destructive-light border border-destructive/20 rounded-[2rem] text-center max-w-2xl mx-auto space-y-4">
      <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
      <h3 className="text-lg font-bold text-destructive">{title}</h3>
      <p className="text-destructive/80 text-base font-medium">{message}</p>
      {onRetry && (
        <Button variant="danger" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}