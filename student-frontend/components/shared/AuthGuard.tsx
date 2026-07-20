'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  onAuthSuccess?: (token: string, username: string, role: string) => void;
}

export default function AuthGuard({ children, onAuthSuccess }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username') || 'User';
    const storedRole = localStorage.getItem('role') || 'STUDENT';

    if (!token) {
      router.push('/login');
      return;
    }

    if (onAuthSuccess) {
      onAuthSuccess(token, name, storedRole);
    }

    setIsAuthorized(true);
  }, [router, onAuthSuccess]);

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-sidebar">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary text-sm font-semibold mt-4">Verifying session...</p>
      </div>
    );
  }

  return <>{children}</>;
}