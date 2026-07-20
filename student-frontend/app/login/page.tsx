'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (response.ok) {
        const resJson = await response.json();
        const data = resJson.data;

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);

        let redirectRole = data.role?.toUpperCase();
        if (redirectRole === 'LECTURER') {
          redirectRole = 'TEACHER';
        }

        if (redirectRole === 'STUDENT') {
          router.push('/dashboard');
        } else if (redirectRole === 'TEACHER') {
          router.push('/dashboard/teacher');
        } else if (redirectRole === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          setError('Unknown user role. Please contact support.');
        }
      } else {
        const errorText = await response.text();
        try {
          const jsonError = JSON.parse(errorText);
          setError(jsonError.message || 'Invalid username or password. Please try again.');
        } catch {
          setError(errorText || 'Invalid username or password. Please try again.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server connection error. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-card flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-primary/20 selection:text-primary-hover">

      {/* Login Card */}
      <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
        <form
          onSubmit={handleLogin}
          className="bg-muted p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-primary/20 border border-muted-border flex flex-col transition-all"
        >
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-1.5">AuraEdu</h2>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Sign in to your portal</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="font-medium text-sm leading-snug">{error}</p>
            </div>
          )}

          {/* Input Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wider mb-1.5" htmlFor="username">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-card border border-muted-border rounded-2xl pl-11 pr-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-medium"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-card border border-muted-border rounded-2xl pl-11 pr-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-medium"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-4 flex items-center justify-center py-4 rounded-2xl font-semibold text-white transition-all uppercase text-sm tracking-wider shadow-lg ${isLoading
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-primary hover:bg-primary-hover shadow-primary/20 hover:scale-[1.01]'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Registration Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold uppercase tracking-wider text-primary hover:text-primary-hover hover:underline transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}