'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username.trim(), 
          email: email.trim(),
          password 
        }),
      });

      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login... 🎉');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError('Registration failed. Username or email might already be taken.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0e1e] flex items-center justify-center px-4 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '9s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-purple-650/15 blur-[120px] pointer-events-none animate-pulse delay-300" style={{ animationDuration: '11s' }} />

      {/* Centered Card */}
      <div className="w-full max-w-md relative z-10">
        <form 
          onSubmit={handleRegister} 
          className="bg-[#121634]/40 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-[#212854]/40 flex flex-col transition-all"
        >
          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-1.5">AuraEdu</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Create your portal account</p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-rose-500/10 border border-rose-550/20 text-rose-450 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="font-semibold text-xs leading-snug">{error}</p>
            </div>
          )}

          {/* Success Alert Box */}
          {success && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider animate-pulse">
              {success}
            </div>
          )}
          
          <div className="space-y-5">
            {/* Username Field */}
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
                  placeholder="Choose a username"
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-[#0b0e1e]/60 border border-[#212854]/60 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-[#5c4fe5] transition-all"
                  disabled={isLoading || !!success}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="email">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-white transition-colors" />
                </div>
                <input 
                  id="email"
                  type="email" 
                  placeholder="Enter your email"
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#0b0e1e]/60 border border-[#212854]/60 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-[#5c4fe5] transition-all"
                  disabled={isLoading || !!success}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
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
                  placeholder="Create a password"
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#0b0e1e]/60 border border-[#212854]/60 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-[#5c4fe5] transition-all"
                  disabled={isLoading || !!success}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading || !!success}
              className={`w-full mt-2 font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center uppercase text-xs tracking-wider
                ${(isLoading || !!success)
                  ? 'bg-slate-800 text-slate-550 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-blue-650 to-indigo-650 hover:from-blue-550 hover:to-indigo-550 text-white shadow-blue-900/50'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Register'
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-extrabold uppercase tracking-wider transition-colors hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}