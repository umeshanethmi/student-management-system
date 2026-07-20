'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  icon,
}: ButtonProps) {
  const theme = useTheme();

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-sm',
  };

  const getVariantStyle = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.primary,
          color: '#ffffff',
          boxShadow: `0 4px 14px ${theme.primary}40`,
          border: `1px solid ${theme.primary}`,
        };
      case 'danger':
        return {
          backgroundColor: theme.destructive,
          color: '#ffffff',
          boxShadow: `0 4px 14px ${theme.destructive}40`,
          border: `1px solid ${theme.destructive}`,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: theme.primary,
          border: `1px solid ${theme.mutedBorder}`,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: theme.textMuted || '#64748b',
          border: '1px solid transparent',
        };
      default:
        return {};
    }
  };

  const getHoverStyle = (): React.CSSProperties => {
    // Return empty — hover handled via CSS :hover in inline styles isn't possible,
    // so we use group-hover or opacity approach
    return {};
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={getVariantStyle()}
      className={`
        relative
        inline-flex items-center justify-center gap-2
        font-semibold rounded-xl
        uppercase tracking-wider
        transition-all duration-200
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          {children}
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}