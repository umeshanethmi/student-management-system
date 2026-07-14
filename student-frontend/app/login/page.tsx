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
        
        // Store credentials securely in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        
        // Redirect based on selected role returned from backend
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

  const theme = {
    activeClass: 'bg-[#5c4fe5] text-white shadow-lg shadow-indigo-500/20',
    gradient: 'from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-indigo-900/40',
    accent: 'text-indigo-400'
  };

  return (
    <div className="min-h-screen bg-[#0b0e1e] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-650/15 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none animate-pulse delay-500" style={{ animationDuration: '10s' }} />

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <form 
          onSubmit={handleLogin} 
          className="bg-[#121634]/40 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-[#212854]/40 flex flex-col transition-all"
        >
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-1.5">AuraEdu</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Sign in to your portal</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-rose-500/10 border border-rose-550/20 text-rose-450 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="font-semibold text-xs leading-snug">{error}</p>
            </div>
          )}

          {/* Input Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="username">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500 group-focus-within:text-white transition-colors" />
                </div>
                <input 
                  id="username"
                  type="text" 
                  placeholder="Enter your username"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0b0e1e]/60 border border-[#212854]/60 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-[#5c4fe5] transition-all"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-white transition-colors" />
                </div>
                <input 
                  id="password"
                  type="password" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0b0e1e]/60 border border-[#212854]/60 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-[#5c4fe5] transition-all"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full mt-4 flex items-center justify-center py-3.5 rounded-xl font-bold text-white transition-all uppercase text-xs tracking-wider shadow-lg ${
                isLoading
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                  : `bg-gradient-to-r ${theme.gradient}`
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
            <p className="text-xs text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className={`font-extrabold uppercase tracking-wider hover:underline transition-colors ${theme.accent}`}>
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}