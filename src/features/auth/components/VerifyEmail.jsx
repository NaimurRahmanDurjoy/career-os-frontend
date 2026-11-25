import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, CheckCircle2, AlertCircle, Loader2, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const resendOtp = useAuthStore((state) => state.resendOtp);

  // Retrieve email from navigation state or sessionStorage
  const [email, setEmail] = useState(() => {
    return location.state?.email || sessionStorage.getItem('pending_verification_email') || '';
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || 'We sent a 6-digit verification code to your email.'
  );
  const [resendCooldown, setResendCooldown] = useState(60);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (email) {
      sessionStorage.setItem('pending_verification_email', email);
    } else {
      // If no pending email, redirect to login
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Take the last character typed
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setErrorMessage('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await verifyOtp(email, fullOtp);
      sessionStorage.removeItem('pending_verification_email');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Invalid or expired verification code. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setErrorMessage('');
    try {
      const res = await resendOtp(email);
      setSuccessMessage(res.message || 'New verification code sent to your inbox.');
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to resend code. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Heading */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/5">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Verify Your Email</h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
            To protect your account, enter the 6-digit code sent to <br />
            <strong className="text-emerald-400 font-semibold">{email}</strong>
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2.5">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* OTP Input Boxes */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="flex justify-between gap-2.5" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                autoFocus={idx === 0}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black bg-slate-950 border border-slate-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl text-white outline-none transition-all shadow-inner"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            {isLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Verifying Code...</>
            ) : (
              <>Verify & Enter Workspace <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        {/* Resend Section */}
        <div className="text-center pt-2 relative z-10 space-y-3">
          <p className="text-xs text-slate-400">
            Didn't receive the email? Check your Spam or Promotions folder.
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw size={13} className={isResending ? 'animate-spin' : ''} />
            <span>
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : 'Resend 6-Digit Code'}
            </span>
          </button>
        </div>

        {/* Change Email / Back to Login */}
        <div className="text-center border-t border-slate-800/80 pt-4 relative z-10">
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem('pending_verification_email');
              navigate('/login');
            }}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
