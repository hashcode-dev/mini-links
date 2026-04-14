import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Link as LinkIcon, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { isAuthenticated, setAuthSession } from '../lib/auth';
import { signInWithGoogle } from '../lib/googleAuth';

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
    <div className="min-h-screen flex bg-surface dark:bg-navy text-navy dark:text-surface">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-24">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
              <LinkIcon size={20} />
            </div>
            <span className="text-xl font-black text-primary dark:text-teal-400 font-display leading-none">Mini Links</span>
          </Link>

          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-navy dark:text-white">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {isLogin ? 'Sign in to your dashboard to manage your links.' : 'Start optimizing your links in seconds.'}
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-8">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              className="w-full py-3 px-4 bg-surface-container-lowest dark:bg-navy-light border border-surface-container-high dark:border-slate-700 rounded-lg text-sm font-bold text-navy dark:text-white hover:bg-surface-container-low dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}
            </button>
            <button type="button" className="w-full py-3 px-4 bg-surface-container-lowest dark:bg-navy-light border border-surface-container-high dark:border-slate-700 rounded-lg text-sm font-bold text-navy dark:text-white hover:bg-surface-container-low dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
              <Github size={20} />
              Continue with GitHub
            </button>
          </div>

          {errorMessage && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/40 dark:text-red-300">
              {errorMessage}
            </p>
          )}

          <div className="relative flex items-center py-4 mb-4">
            <div className="flex-grow border-t border-surface-container-high dark:border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with email</span>
            <div className="flex-grow border-t border-surface-container-high dark:border-slate-700"></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="Your name" 
                    className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-navy border border-surface-container-high dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-lg text-navy dark:text-white transition-all outline-none"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com" 
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest dark:bg-navy border border-surface-container-high dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-lg text-navy dark:text-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password</label>
                {isLogin && <a href="#" className="text-xs font-bold text-primary dark:text-teal-400 hover:underline">Forgot your password?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest dark:bg-navy border border-surface-container-high dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-lg text-navy dark:text-white transition-all outline-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-cta hover:bg-cta-dark text-white font-bold rounded-lg shadow-lg shadow-cta/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-bold text-primary dark:text-teal-400 hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-3 w-full rounded-lg border border-surface-container-high dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Right Side: Graphic/Testimonial */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cta via-transparent to-transparent"></div>
        </div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-xl font-medium leading-relaxed mb-6">
              "Mini Links has completely transformed how we track our campaigns. The interface is incredibly clean, and the analytics are exactly what we needed to scale."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">
                S
              </div>
              <div>
                <p className="font-bold font-display">Sarah Jenkins</p>
                <p className="text-sm text-white/70">Marketing Director, TechFlow</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8 text-white/60 text-sm font-medium">
            <span>Enterprise-Grade Link Management</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
            <span>Real-Time Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
