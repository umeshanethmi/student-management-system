'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for form validation and API messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Basic email validation regex
  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Handle the form submission
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side form validation
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
      const response = await fetch('http://localhost:8080/api/auth/register', {
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
        
        // Automatically redirect the user to '/login' after exactly 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        // Handle error states (e.g., username is taken)
        setError('Registration failed. Username or email might already be taken.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      // Handle network errors beautifully
      setError('Network error. Please ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Soft blue and purple glowing ambient background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Centered glassmorphic registration card */}
      <div className="w-full max-w-md relative z-10">
        <form 
          onSubmit={handleRegister} 
          className="bg-slate-900/50 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-700"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Create Account</h2>
            <p className="text-sm text-slate-400">Join the platform to continue</p>
          </div>

          {/* Smooth Tailwind red-400 alert message */}
          {error && (
            <div className="mb-6 bg-red-900/40 text-red-400 border border-red-800/50 rounded-xl px-4 py-3 text-sm font-medium animate-pulse">
              {error}
            </div>
          )}

          {/* Striking green alert box for success */}
          {success && (
            <div className="mb-6 bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 rounded-xl px-4 py-3 text-sm font-medium animate-pulse">
              {success}
            </div>
          )}
          
          <div className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="username">
                Username
              </label>
              <input 
                id="username"
                type="text" 
                placeholder="Choose a username"
                value={username} 
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-slate-600"
                disabled={isLoading || !!success}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="email">
                Email
              </label>
              <input 
                id="email"
                type="email" 
                placeholder="Enter your email"
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-slate-600"
                disabled={isLoading || !!success}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="password">
                Password
              </label>
              <input 
                id="password"
                type="password" 
                placeholder="Create a password"
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-slate-600"
                disabled={isLoading || !!success}
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading || !!success}
              className={`w-full mt-2 font-semibold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center
                ${(isLoading || !!success)
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/50 hover:shadow-blue-900/70'
                }`}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}