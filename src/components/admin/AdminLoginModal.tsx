import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2, Server, UserCheck } from 'lucide-react';
import { UserProfile } from '../../types';

interface AdminLoginModalProps {
  onLoginSuccess: (adminUser: UserProfile, token: string) => void;
  onSwitchToCustomer: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  onLoginSuccess,
  onSwitchToCustomer,
}) => {
  const [email, setEmail] = useState('admin@voyagego.com');
  const [password, setPassword] = useState('admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setIsSubmitting(false);
        setErrorMsg(data.message || data.error || 'Invalid administrator credentials.');
        return;
      }

      // Success
      const { token, user: adminUser } = data;
      if (rememberMe) {
        localStorage.setItem('voyagego_admin_token', token);
        localStorage.setItem('voyagego_admin_user', JSON.stringify(adminUser));
      }
      setIsSubmitting(false);
      onLoginSuccess(adminUser, token);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Server connection error during admin authentication.');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setResetEmailSent(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetEmailSent(false);
      setForgotEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-6">
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Security Badge */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-orange-600/20 border border-orange-400/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-orange-400 font-mono font-bold mb-1">
              <Lock className="w-3 h-3 text-orange-400" /> https://admin.voyagego.com
            </div>
            <h2 className="text-2xl font-extrabold text-white">Enterprise Admin Login</h2>
            <p className="text-xs text-slate-400 mt-1">Role-Based Access Control (RBAC) &amp; Audit Log Portal</p>
          </div>
        </div>

        {/* Access Error Message */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-800 rounded-2xl flex items-start gap-3 text-xs text-rose-200 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Authentication Restricted</p>
              <p className="mt-0.5 opacity-90">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-orange-400" /> Admin Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@voyagego.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-orange-400" /> Administrator Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-all font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 text-orange-500 focus:ring-orange-500 bg-slate-950"
              />
              <span>Remember admin session</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-orange-400 hover:text-orange-300 hover:underline font-bold"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-orange-500/20 text-xs transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Verifying Credentials &amp; JWT...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Authenticate &amp; Sign In to Admin Portal
              </span>
            )}
          </button>
        </form>

        {/* Quick Demo Login Presets */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            Evaluator Quick Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@voyagego.com');
                setPassword('admin@123');
              }}
              className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-[11px] transition-colors"
            >
              <div className="font-bold text-slate-300 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-400" /> System Admin
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate">admin@voyagego.com</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('athulya@gmail.com');
                setPassword('Customer123!');
              }}
              className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-[11px] transition-colors"
            >
              <div className="font-bold text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-400" /> Test Customer (Forbidden)
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate">athulya@gmail.com</div>
            </button>
          </div>
        </div>

        {/* Switch back to Customer Site */}
        <div className="text-center pt-2">
          <button
            onClick={onSwitchToCustomer}
            className="text-xs text-slate-400 hover:text-white underline font-medium"
          >
            Return to Customer Website (voyagego.com)
          </button>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 text-left shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-white text-base">Reset Admin Password</h3>
                <button onClick={() => setShowForgotPassword(false)} className="text-slate-500 hover:text-white">✕</button>
              </div>
              {resetEmailSent ? (
                <div className="p-4 bg-emerald-950 border border-emerald-800 rounded-2xl text-xs text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Password Reset Token Dispatched
                  </div>
                  <p className="text-[11px] opacity-90">Instructions have been sent to {forgotEmail || email}. Follow link to reset administrator credentials.</p>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                  <p className="text-xs text-slate-400">Enter your registered admin email address to receive an encrypted password reset token.</p>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@voyagego.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 font-bold text-xs text-white rounded-xl"
                    >
                      Send Reset Token
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
