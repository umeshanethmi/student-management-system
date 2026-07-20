'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormInputProps {
  id?: string;
  label: string;
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function FormInput({
  id,
  label,
  icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled,
  required,
}: FormInputProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 mb-1.5 block">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
          {icon}
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full bg-white border ${
            error ? 'border-destructive' : 'border-muted-border'
          } rounded-2xl ${icon ? 'pl-11' : 'pl-4'} pr-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-medium ${
            disabled ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        />
      </div>
      {error && (
        <p className="text-destructive text-sm font-medium mt-1 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}