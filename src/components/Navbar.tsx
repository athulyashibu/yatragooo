import React, { useState, useRef, useEffect } from 'react';
import {
  Plane,
  Coins,
  Wallet,
  Heart,
  ShieldCheck,
  Ticket,
  ChevronDown,
  Bell,
  User,
  LogOut,
  Settings,
  HelpCircle,
  Gift,
  Sparkles,
  LogIn,
  UserPlus,
  Camera,
} from 'lucide-react';
import { TravelMode, UserProfile } from '../types';
import { UserAvatar } from './common/UserAvatar';
import { ProfilePictureModal } from './profile/ProfilePictureModal';

interface NavbarProps {
  currentMode: TravelMode;
  onSelectMode: (mode: TravelMode) => void;
  isAuthenticated: boolean;
  user: UserProfile;
  wishlistCount: number;
  activeBookingsCount: number;
  unreadNotificationsCount?: number;
  onOpenWishlist: () => void;
  onOpenBookings: () => void;
  onOpenNotifications?: () => void;
  onOpenWallet?: () => void;
  onOpenSettings?: () => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onLogout: () => void;
  onUpdateUserProfile?: (updated: Partial<UserProfile>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  isAuthenticated,
  user,
  wishlistCount,
  activeBookingsCount,
  unreadNotificationsCount = 0,
  onOpenWishlist,
  onOpenBookings,
  onOpenNotifications,
  onOpenWallet,
  onOpenSettings,
  onLoginClick,
  onSignUpClick,
  onLogout,
  onUpdateUserProfile,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Handle Logout safely
  const handleLogoutAction = () => {
    setIsProfileMenuOpen(false);
    onLogout();
  };

  return (
    <header id="main-navbar" className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      <div id="top-announcement-bar" className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 text-white font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
              PROMO
            </span>
            <span>
              Use code <strong className="text-orange-400">VOYAGEFLY50</strong> for $50 off international flights &amp; 15% off hotels!
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 hover:text-white cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Price Lock Guarantee
            </span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline hover:text-white cursor-pointer">24/7 Global Support (+1-800-VOYAGE)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          id="brand-logo"
          onClick={() => onSelectMode('flights')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform duration-200">
            <Plane className="w-6 h-6 stroke-[2.5] transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-sans">
                Voyage<span className="text-orange-500">Go</span>
              </span>
              <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full border border-orange-200">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">
              GLOBAL TRAVEL &amp; TOURISM PLATFORM
            </p>
          </div>
        </div>

        {/* Right Section: Authentication-Based Navigation */}
        <div id="user-nav-actions" className="flex items-center gap-2.5">
          {!isAuthenticated ? (
            /* Guest Navigation: Login & Sign Up */
            <div className="flex items-center gap-2">
              <button
                id="btn-login"
                onClick={onLoginClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all"
              >
                <LogIn className="w-4 h-4 text-orange-500" />
                <span>Log In</span>
              </button>
              <button
                id="btn-signup"
                onClick={onSignUpClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-orange-500 hover:bg-orange-600 shadow-sm hover:shadow-md transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>
          ) : (
            /* Authenticated Navigation: Wallet, Notifications, My Bookings, Wishlist, Profile Dropdown */
            <>
              {/* Voyage Wallet & Coins */}
              <div
                id="user-wallet-pill"
                onClick={onOpenWallet || (() => onSelectMode('dashboard'))}
                title="Voyage Wallet & Rewards"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-800 text-xs font-semibold cursor-pointer hover:bg-orange-100 transition-colors"
              >
                <Wallet className="w-4 h-4 text-orange-600" />
                <span>${user.walletBalance.toFixed(2)}</span>
                <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>{user.voyageCoins} pts</span>
              </div>

              {/* Notifications Icon */}
              <button
                id="btn-notifications"
                onClick={onOpenNotifications}
                className="relative p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4.5 h-4.5 text-orange-500" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* My Bookings Button */}
              <button
                id="btn-my-bookings"
                onClick={onOpenBookings}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                <Ticket className="w-4 h-4 text-orange-500" />
                <span className="hidden md:inline">My Bookings</span>
                {activeBookingsCount > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {activeBookingsCount}
                  </span>
                )}
              </button>

              {/* Wishlist Icon */}
              <button
                id="btn-wishlist"
                onClick={onOpenWishlist}
                className="relative p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                title="Saved Wishlist"
              >
                <Heart className="w-4.5 h-4.5 text-rose-500" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  id="btn-user-profile"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  aria-expanded={isProfileMenuOpen}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all text-left focus:outline-none cursor-pointer"
                >
                  <UserAvatar
                    src={user.avatar}
                    name={user.name}
                    size="sm"
                    showRing={true}
                    ringColor="ring-orange-400/30"
                  />
                  <div className="hidden sm:block text-xs">
                    <p className="font-bold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-orange-600 font-semibold">{user.tier} Member</p>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      isProfileMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Floating Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div
                    id="profile-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    {/* User Header Summary inside Dropdown */}
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                      <div className="relative group cursor-pointer" onClick={() => { setIsProfileMenuOpen(false); setIsAvatarModalOpen(true); }}>
                        <UserAvatar
                          src={user.avatar}
                          name={user.name}
                          size="md"
                          showRing={true}
                          ringColor="ring-orange-400/40"
                        />
                        <div className="absolute inset-0 bg-slate-900/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <Camera className="w-3.5 h-3.5 text-orange-400" />
                        </div>
                      </div>
                      <div className="overflow-hidden flex-1">
                        <p className="font-extrabold text-sm text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[9px] font-extrabold bg-orange-100 text-orange-800 px-2 py-0.2 rounded-full uppercase">
                            {user.tier} Traveler
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items List */}
                    <div className="py-1">
                      {/* Change Profile Picture */}
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setIsAvatarModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5 transition-colors"
                      >
                        <Camera className="w-4 h-4 text-orange-500" />
                        <span>Change Profile Picture</span>
                      </button>

                      {/* 1. My Profile */}
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onSelectMode('dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </button>

                      {/* 2. My Bookings */}
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenBookings();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5 transition-colors"
                      >
                        <Ticket className="w-4 h-4 text-orange-500" />
                        <span>My Bookings</span>
                        {activeBookingsCount > 0 && (
                          <span className="ml-auto bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.2 rounded-full">
                            {activeBookingsCount}
                          </span>
                        )}
                      </button>

                      {/* 3. Wallet */}
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          if (onOpenWallet) onOpenWallet();
                          else onSelectMode('dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5 transition-colors"
                      >
                        <Wallet className="w-4 h-4 text-orange-500" />
                        <span>Wallet</span>
                        <span className="ml-auto font-bold text-emerald-600 text-xs">
                          ${user.walletBalance.toFixed(2)}
                        </span>
                      </button>

                      {/* 4. Rewards & Points */}
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          if (onOpenWallet) onOpenWallet();
                          else onSelectMode('dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5 transition-colors"
                      >
                        <Gift className="w-4 h-4 text-amber-500" />
                        <span>Rewards &amp; Points</span>
                        <span className="ml-auto text-amber-600 font-bold text-xs">
                          {user.voyageCoins} pts
                        </span>
                      </button>

                      {/* 5. Settings */}
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          if (onOpenSettings) onOpenSettings();
                          else onSelectMode('dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span>Settings</span>
                      </button>

                      {/* 6. Help & Support */}
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onSelectMode('dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-blue-500" />
                        <span>Help &amp; Support</span>
                      </button>
                    </div>

                    {/* Divider & 7. Logout */}
                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        id="btn-logout"
                        onClick={handleLogoutAction}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile Picture Management Modal */}
      {isAuthenticated && (
        <ProfilePictureModal
          isOpen={isAvatarModalOpen}
          currentAvatar={user.avatar}
          userName={user.name}
          userEmail={user.email}
          onClose={() => setIsAvatarModalOpen(false)}
          onSaveAvatar={(newAvatarUrl) => {
            if (onUpdateUserProfile) {
              onUpdateUserProfile({ avatar: newAvatarUrl });
            }
          }}
        />
      )}
    </header>
  );
};
