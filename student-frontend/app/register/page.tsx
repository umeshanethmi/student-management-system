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
    <div className="min-h-screen bg-card flex items-center justify-center px-4 relative overflow-hidden font-sans selection:bg-primary/20 selection:text-primary-hover">
      
      {/* Centered Card */}
      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <form 
          onSubmit={handleRegister} 
          className="bg-muted p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-primary/20 border border-muted-border flex flex-col transition-all"
        >
          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-105">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-1.5">AuraEdu</h2>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Create your portal account</p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="font-medium text-sm leading-snug">{error}</p>
            </div>
          )}

          {/* Success Alert Box */}
          {success && (
            <div className="mb-6 bg-primary-light border border-primary/20 text-primary rounded-xl px-4 py-3.5 text-sm font-semibold uppercase tracking-wider">
              {success}
            </div>
          )}
          
          <div className="space-y-5">
            {/* Username Field */}
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
                  placeholder="Choose a username"
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-card border border-muted-border rounded-xl pl-11 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-medium"
                  disabled={isLoading || !!success}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wider mb-1.5" htmlFor="email">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                  id="email"
                  type="email" 
                  placeholder="Enter your email"
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-card border border-muted-border rounded-xl pl-11 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-medium"
                  disabled={isLoading || !!success}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
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
                  placeholder="Create a password"
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-card border border-muted-border rounded-xl pl-11 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-medium"
                  disabled={isLoading || !!success}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading || !!success}
              className={`w-full mt-2 font-semibold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center uppercase text-sm tracking-wider
                ${(isLoading || !!success)
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                  : 'bg-primary hover:bg-primary-hover text-white shadow-primary/20 hover:scale-[1.01]'
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
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary-hover font-semibold uppercase tracking-wider transition-colors hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}