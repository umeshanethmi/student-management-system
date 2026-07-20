'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'default' | 'lg';
}

export default function Modal({ isOpen, onClose, title, description, children, size = 'default' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        className={`bg-card border border-muted-border/80 rounded-[2.2rem] p-8 shadow-2xl my-8 relative animate-in zoom-in-95 duration-200 ${
          size === 'lg' ? 'max-w-2xl w-full' : 'max-w-xl w-full'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-muted text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {title && (
          <div className="flex items-center gap-3 pb-3 border-b border-muted-border mb-6">
            <div className="w-9 h-9 bg-primary-light rounded-xl flex items-center justify-center text-primary shadow-inner">
              <X className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{title}</h3>
              {description && (
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{description}</p>
              )}
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}