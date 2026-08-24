import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { getRandomDefaultAvatar, getDefaultAvatarForUser } from '../../utils/avatars';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup' | 'forgot' | 'admin';
  onClose: () => void;
  onLoginSuccess: (userProfile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'verify' | 'admin'>(initialMode);
  const wasOpenRef = React.useRef(false);

  React.useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setMode(initialMode);
      setErrorMessage('');
      setSuccessMessage('');
    }
    wasOpenRef.current = isOpen;
  }, [initialMode, isOpen]);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign Up State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Verify OTP state
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  
  // Feedback / Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2 || score === 3) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong & Secure', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  // Form Submission for Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      if (email.trim().toLowerCase() === 'error@voyagego.com') {
        throw new Error('Invalid credentials or account locked. Please check your credentials.');
      }

      const userProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        name: fullName || (email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'Traveler'),
        email: email.trim(),
        phone: phone || '+1 (555) 234-5678',
        role: 'customer',
        avatar: getDefaultAvatarForUser(email),
        walletBalance: 250.00,
        voyageCoins: 500,
        tier: 'Gold',
        isEmailVerified: true,
        address: '100 Voyage Blvd, San Francisco, CA',
        dateOfBirth: '1995-06-15',
        gender: 'Prefer not to say',
        preferredLanguage: 'English (US)',
        preferredCurrency: 'USD ($)',
        createdAt: new Date().toISOString(),
      };

      const syncRes = await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      let finalUser = userProfile;
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        if (syncData && syncData.user) {
          finalUser = syncData.user;
        }
      }

      // Issue JWT token
      const tokenRes = await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: finalUser.id,
          email: finalUser.email,
          role: finalUser.role,
          name: finalUser.name,
        }),
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        if (tokenData && tokenData.token) {
          localStorage.setItem('voyagego_auth_token', tokenData.token);
          localStorage.setItem('voyagego_user_session', JSON.stringify(finalUser));
        }
      }

      setSuccessMessage('Logged in successfully!');
      onLoginSuccess(finalUser);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Form Submission for Admin Portal Login
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both admin email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const lowerEmail = email.toLowerCase().trim();

      if (
        lowerEmail.includes('customer') ||
        lowerEmail.includes('sarah.c') ||
        lowerEmail === 'user@voyagego.com'
      ) {
        throw new Error('Access Denied: Customer accounts do not have administrator privileges. Please use the Log In tab.');
      }

      if (lowerEmail === 'error@voyagego.com') {
        throw new Error('Invalid admin credentials or account locked. Please try again.');
      }

      const adminUser: UserProfile = {
        id: `usr_admin_${Date.now()}`,
        name: email.split('@')[0] ? email.split('@')[0].toUpperCase() + ' (Admin)' : 'Alex Mercer (Admin)',
        email: lowerEmail,
        phone: '+1 (555) 349-8201',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        walletBalance: 450.00,
        voyageCoins: 1250,
        tier: 'Platinum',
        isEmailVerified: true,
        address: '100 Executive Way, San Francisco, CA',
        createdAt: new Date().toISOString(),
      };

      const syncRes = await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminUser),
      });

      let finalAdmin = adminUser;
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        if (syncData && syncData.user) {
          finalAdmin = syncData.user;
        }
      }

      const tokenRes = await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: finalAdmin.id,
          email: finalAdmin.email,
          role: 'admin',
          name: finalAdmin.name,
        }),
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        if (tokenData && tokenData.token) {
          localStorage.setItem('voyagego_auth_token', tokenData.token);
          localStorage.setItem('voyagego_admin_token', tokenData.token);
          localStorage.setItem('voyagego_user_session', JSON.stringify(finalAdmin));
          localStorage.setItem('voyagego_admin_user', JSON.stringify(finalAdmin));
        }
      }

      setSuccessMessage('Admin authenticated successfully!');
      onLoginSuccess(finalAdmin);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Admin authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Form Submission for Sign Up
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setErrorMessage('All registration fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('You must accept the VoyageGo Terms of Service to register.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Registration successful! Verification code sent to your email.');
      setMode('verify');
      setOtpSent(true);
    }, 700);
  };

  // Google OAuth Simulation
  const handleGoogleAuth = () => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      const googleUser: UserProfile = {
        id: `usr_google_${Date.now()}`,
        name: 'Google User',
        email: 'user.google@gmail.com',
        phone: '+1 (555) 987-6543',
        role: 'customer',
        avatar: getRandomDefaultAvatar(),
        walletBalance: 300.00,
        voyageCoins: 750,
        tier: 'Platinum',
        isEmailVerified: true,
        preferredLanguage: 'English (US)',
        preferredCurrency: 'USD ($)',
      };
      onLoginSuccess(googleUser);
      onClose();
    }, 500);
  };

  // Forgot Password request
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Password reset instructions sent to ' + email);
      setMode('verify');
    }, 600);
  };

  // Verify OTP Submission
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const verifiedUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: fullName || 'Verified Traveler',
        email: email || 'user@voyagego.com',
        phone: phone || '+1 (555) 444-3322',
        role: 'customer',
        avatar: getRandomDefaultAvatar(),
        walletBalance: 250.00,
        voyageCoins: 500,
        tier: 'Gold',
        isEmailVerified: true,
      };
      onLoginSuccess(verifiedUser);
      onClose();
    }, 500);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        id="auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative my-8"
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-6 text-white relative">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              if (!isLoading) onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4.5 h-4.5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              VoyageGo Authentication
            </span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">
            {mode === 'login' && 'Welcome Back to VoyageGo'}
            {mode === 'signup' && 'Create Your Traveler Account'}
            {mode === 'admin' && 'Enterprise Admin Portal'}
            {mode === 'forgot' && 'Reset Your Password'}
            {mode === 'verify' && 'Verify Email Address'}
          </h2>
          <p className="text-xs text-orange-100 mt-1">
            {mode === 'login' && 'Sign in to access your bookings, wallet, and rewards.'}
            {mode === 'signup' && 'Register now to unlock instant $25 travel credit & voyage coins.'}
            {mode === 'admin' && 'Secure administrative access for VoyageGo platform managers.'}
            {mode === 'forgot' && 'Enter your registered email address to receive password reset link.'}
            {mode === 'verify' && 'Enter the 6-digit security code sent to your email.'}
          </p>
        </div>

        {/* Auth Mode Switcher Tabs */}
        {(mode === 'login' || mode === 'signup' || mode === 'admin') && (
          <div className="flex border-b border-slate-200 bg-slate-50/50">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-3 px-2 text-[11px] sm:text-xs font-extrabold transition-colors text-center ${
                mode === 'login'
                  ? 'text-orange-600 border-b-2 border-orange-500 bg-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-3 px-2 text-[11px] sm:text-xs font-extrabold transition-colors text-center ${
                mode === 'signup'
                  ? 'text-orange-600 border-b-2 border-orange-500 bg-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register (Sign Up)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('admin');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-3 px-2 text-[11px] sm:text-xs font-extrabold transition-colors text-center flex items-center justify-center gap-1 ${
                mode === 'admin'
                  ? 'text-orange-600 border-b-2 border-orange-500 bg-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 hidden xs:inline shrink-0" />
              <span>Admin Portal</span>
            </button>
          </div>
        )}

        {/* Modal Inner Body */}
        <div className="p-6 space-y-4">
          {/* Toast / Feedback Messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. alex.mercer@voyagego.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-[11px] font-bold text-orange-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-400"
                  />
                  <span>Remember Me</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">JWT 256-bit Encrypted</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Log In to VoyageGo</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* OAuth Google Sign In */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[11px]">
                  <span className="px-2 bg-white text-slate-400 font-semibold uppercase">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.05.01 12s.45 3.8 1.26 5.42l4.01-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Google Sign-In</span>
              </button>
            </form>
          )}

          {/* 2. SIGN UP / REGISTER FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="name@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-8 pr-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                      <div className={`h-full flex-1 ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`}></div>
                      <div className={`h-full flex-1 ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`}></div>
                      <div className={`h-full flex-1 ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{strength.label}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer text-xs font-medium text-slate-600 pt-1">
                <input
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
                />
                <span>
                  I agree to the{' '}
                  <span className="text-orange-600 font-bold hover:underline">Terms of Service</span> &amp;{' '}
                  <span className="text-orange-600 font-bold hover:underline">Privacy Policy</span>.
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ADMIN PORTAL FORM */}
          {mode === 'admin' && (
            <form onSubmit={handleAdminLoginSubmit} className="space-y-3.5">
              <div className="p-3 bg-amber-50/90 border border-amber-200/80 rounded-xl text-amber-900 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Restricted Area: Authorized administrative personnel only.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="admin@voyagego.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-[11px] font-bold text-orange-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-400"
                  />
                  <span>Remember Me</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">RBAC Admin Session</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Authenticating Admin...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Secure Admin Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-3.5">
              <p className="text-xs text-slate-600">
                Enter your registered account email. We will send you a 6-digit verification security code to reset your password.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Sending Reset Code...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Send Password Reset Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 pt-2"
              >
                ← Back to Login
              </button>
            </form>
          )}

          {/* 4. VERIFY EMAIL OTP FORM */}
          {mode === 'verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
              <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 inline-block">
                <ShieldCheck className="w-8 h-8 text-orange-600 mx-auto" />
              </div>

              <h3 className="text-sm font-extrabold text-slate-800">Enter Security Code</h3>
              <p className="text-xs text-slate-500">
                We sent a 6-digit code to <strong className="text-slate-700">{email || 'your email'}</strong>
              </p>

              <div className="flex justify-center gap-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otpCode];
                      newOtp[idx] = e.target.value;
                      setOtpCode(newOtp);
                    }}
                    className="w-10 h-10 text-center font-bold text-base bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Verifying Code...</span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Verify &amp; Log In</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSuccessMessage('A new verification code has been dispatched.');
                }}
                className="text-xs font-bold text-orange-600 hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Resend Verification Code
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
