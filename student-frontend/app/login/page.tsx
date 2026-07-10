'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State for form validation and API errors
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle the form submission
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Basic form validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store credentials securely in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        
        // Redirect to the dashboard immediately upon success
        router.push('/dashboard');
      } else {
        // Handle incorrect credentials
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server connection error. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background elements to enhance the modern glassmorphism aesthetic */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Glassmorphism Login Card */}
      <div className="w-full max-w-md relative z-10">
        <form 
          onSubmit={handleLogin} 
          className="bg-slate-800/80 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-700/50"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h2>
            <p className="text-sm text-slate-400">Sign in to your dashboard to continue</p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-6 bg-red-900/40 text-red-400 border border-red-800/50 rounded-xl px-4 py-3 text-sm font-medium animate-pulse">
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            {/* Username Input Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="username">
                Username
              </label>
              <input 
                id="username"
                type="text" 
                placeholder="Enter your username"
                value={username} 
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
                required
              />
            </div>

            {/* Password Input Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="password">
                Password
              </label>
              <input 
                id="password"
                type="password" 
                placeholder="••••••••"
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
                required
              />
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full mt-2 font-semibold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center
                ${isLoading 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/50 hover:shadow-blue-900/70'
                }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          {/* Registration Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}