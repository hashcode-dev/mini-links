import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { isAuthenticated, setAuthSession } from '../lib/auth';
import { signInWithGoogle } from '../lib/googleAuth';
import Logo from '../components/Logo';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from || '/dashboard';

  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const demoSession = {
      provider: 'email' as const,
      user: {
        id: `email-${Date.now()}`,
        email: 'demo@minilinks.dev',
        name: 'Demo User',
      },
    };

    setAuthSession(demoSession);
    navigate(redirectTo, { replace: true });
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    try {
      await signInWithGoogle(isLogin ? 'login' : 'signup');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google authentication failed.';
      setErrorMessage(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#faf8ff] text-slate-900">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="mb-10">
            <Logo />
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-slate-500">
              {isLogin ? 'Sign in to your dashboard to manage your links.' : 'Start optimizing your links in seconds.'}
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              className="w-full py-2.5 px-4 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}
            </button>
          </div>

          {errorMessage && (
            <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errorMessage}
            </p>
          )}

          <div className="relative flex items-center py-3 mb-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Or email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Your name" 
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com" 
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
                {isLogin && <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Forgot password?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 mt-2 text-sm"
            >
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-semibold text-blue-600 hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Right Side: Gradient Graphic */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#3525cd] to-[#712ae2] relative overflow-hidden items-center justify-center p-12">
        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
            <div className="flex gap-1 mb-4 text-amber-300">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-lg font-medium leading-relaxed mb-6">
              "Mini Links has completely transformed how we track our marketing campaigns. The scannability and fast redirects are outstanding."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-base">
                S
              </div>
              <div>
                <p className="font-semibold text-sm">Sarah Jenkins</p>
                <p className="text-xs text-white/70">Marketing Director, TechFlow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
