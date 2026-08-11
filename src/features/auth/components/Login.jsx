import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { loginSchema } from '../validations/authValidation';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";

export default function Login({ onSwitchToRegister, onSwitchToForgotPassword }) {
  // Select only the exact slice required to prevent unnecessary re-renders
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(() => {
    return sessionStorage.getItem('auth_error') || '';
  });

  // Clean up session storage safely outside of the initializer to survive React Strict Mode
  React.useEffect(() => {
    if (serverError) {
      sessionStorage.removeItem('auth_error');
    }
  }, [serverError]);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear targeted field error proactively once the user modifies the input
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSocialLogin = (provider) => {
    // Redirects directly to the Laravel Socialite initiation endpoint
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    window.location.href = `${backendUrl}/auth/${provider}/redirect`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError('');

    // Execute synchronous client-side validation runtime via Zod
    const validationResult = loginSchema.safeParse(formData);

    if (!validationResult.success) {
      const formattedErrors = {};
      validationResult.error.errors.forEach((error) => {
        formattedErrors[error.path[0]] = error.message;
      });
      setFieldErrors(formattedErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Authentication failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects strictly for Auth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/50 rounded-[2rem] p-10 shadow-2xl shadow-emerald-900/5 dark:shadow-emerald-900/20 space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-full px-4 py-1.5 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Career OS Pro</span>
          </div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 dark:text-emerald-200/60 text-sm font-medium">Authenticate to access your workspace</p>
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-xs font-medium">{serverError}</span>
          </div>
        )}

        {/* Traditional Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />
              <input
                name="email"
                type="text"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm shadow-sm dark:shadow-inner dark:shadow-black/20"
              />
            </div>
            {fieldErrors.email && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium pl-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm shadow-sm dark:shadow-inner dark:shadow-black/20"
              />
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium pl-1">{fieldErrors.password}</p>
            )}
            <div className="flex justify-end pt-1 pr-1">
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] border border-emerald-400/30"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider Section */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-700/50"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            Or continue with
          </span>
          <div className="flex-grow border-t border-slate-700/50"></div>
        </div>

        {/* OAuth Authentication Button */}
        <button
          onClick={() => handleSocialLogin('google')}
          type="button"
          className="w-full bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 font-bold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm group shadow-sm dark:shadow-none"
        >
          <FcGoogle className="h-5 w-5 group-hover:scale-110 transition-transform" />
          Google Account
        </button>

        <div className="text-center pt-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}