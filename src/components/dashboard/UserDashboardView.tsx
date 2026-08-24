import React, { useState } from 'react';
import { fetchBookingReceipt, downloadReceiptPDF, triggerPrintReceipt } from '../../utils/receiptGenerator';
import {
  Ticket,
  Wallet,
  Coins,
  Heart,
  User,
  QrCode,
  Download,
  Share2,
  Gift,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  LogOut,
  Building,
  Plane,
  Palmtree,
  Home,
  Compass,
  KeyRound,
  Trash2,
  Upload,
  Globe,
  DollarSign,
  Calendar,
  Lock,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Search,
  ShieldAlert,
  Info,
  Printer,
  X,
  ExternalLink,
  FileText,
  MessageSquare,
  MapPin,
  HelpCircle,
  ArrowRight,
  Clock,
  Sparkles,
  RefreshCw,
  XCircle,
  Camera,
} from 'lucide-react';
import { Booking, UserProfile, TravelMode } from '../../types';
import { ProfilePictureModal } from '../profile/ProfilePictureModal';
import { UserAvatar } from '../common/UserAvatar';

interface UserDashboardViewProps {
  user: UserProfile;
  bookings: Booking[];
  wishlist: any[];
  onCancelBooking: (pnr: string) => void;
  onUpdateBooking?: (updatedBooking: Booking) => void;
  onRemoveWishlist: (id: string) => void;
  onUpdateUserProfile?: (updatedUser: Partial<UserProfile>) => void;
  onDeleteAccount?: () => void;
  initialTab?: 'bookings' | 'wallet' | 'wishlist' | 'security';
  onSelectMode?: (mode: TravelMode) => void;
}

const getBookingImage = (b: Booking): string => {
  if (b.image) return b.image;
  switch (b.type) {
    case 'Flight':
      return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800';
    case 'Hotel':
      return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';
    case 'Package':
      return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800';
    case 'Bus':
      return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800';
    case 'Train':
      return 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800';
    case 'Cab':
      return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800';
    case 'Experience':
      return 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80&w=800';
    case 'Homestay':
      return 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800';
    default:
      return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800';
  }
};

const getBookingDestination = (b: Booking): string => {
  if (b.destination) return b.destination;
  if (b.subtitle && b.subtitle.includes('➔')) {
    const parts = b.subtitle.split('➔');
    return parts[parts.length - 1].trim();
  }
  return b.subtitle || b.title;
};

const getPaymentStatus = (b: Booking): 'Paid' | 'Refunded' | 'Pending' | 'Processing' => {
  if (b.paymentStatus) return b.paymentStatus;
  if (b.status === 'Cancelled' || b.status === 'Refunded') return 'Refunded';
  if (b.status === 'Confirmed' || b.status === 'Completed') return 'Paid';
  return 'Pending';
};

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  user,
  bookings,
  wishlist,
  onCancelBooking,
  onUpdateBooking,
  onRemoveWishlist,
  onUpdateUserProfile,
  onDeleteAccount,
  initialTab = 'bookings',
  onSelectMode,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'wallet' | 'wishlist' | 'security'>(initialTab);

  // Customer Bookings State
  const [bookingGroupFilter, setBookingGroupFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled' | 'refunds'>('all');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);
  const [cancelConfirmBooking, setCancelConfirmBooking] = useState<Booking | null>(null);
  const [modifyBooking, setModifyBooking] = useState<Booking | null>(null);
  const [supportBooking, setSupportBooking] = useState<Booking | null>(null);

  // Forms & Toast Feedback
  const [supportInquiryType, setSupportInquiryType] = useState('Flight/Hotel Reschedule');
  const [supportMessage, setSupportMessage] = useState('');
  const [modifyNewDate, setModifyNewDate] = useState('');
  const [modifySpecialRequest, setModifySpecialRequest] = useState('');
  const [dashboardToast, setDashboardToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setDashboardToast(msg);
    setTimeout(() => setDashboardToast(null), 4000);
  };

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [ticketModalBooking, setTicketModalBooking] = useState<Booking | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [wishlistCategory, setWishlistCategory] = useState<string>('all');

  // Edit Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user.name);
  const [profilePhone, setProfilePhone] = useState(user.phone);
  const [profileAddress, setProfileAddress] = useState(user.address || '100 Voyage Blvd, San Francisco, CA');
  const [profileDOB, setProfileDOB] = useState(user.dateOfBirth || '1995-06-15');
  const [profileGender, setProfileGender] = useState(user.gender || 'Prefer not to say');
  const [profileLanguage, setProfileLanguage] = useState(user.preferredLanguage || 'English (US)');
  const [profileCurrency, setProfileCurrency] = useState(user.preferredCurrency || 'USD ($)');
  const [profileAvatar, setProfileAvatar] = useState(user.avatar);
  const [profilePassport, setProfilePassport] = useState(user.passportNumber || 'A98765432');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Password Change State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Delete Account Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Security active sessions state
  const [activeSessions, setActiveSessions] = useState([
    { id: 'sess_1', device: 'Chrome on macOS (San Francisco, US)', ip: '192.168.1.101', current: true, date: 'Active Now' },
    { id: 'sess_2', device: 'VoyageGo iOS App (iPhone 15 Pro)', ip: '172.56.21.90', current: false, date: '2 hours ago' },
  ]);

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText?.('ALEX-REF25');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTerminateSession = (id: string) => {
    setActiveSessions(activeSessions.filter((s) => s.id !== id));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUserProfile) {
      onUpdateUserProfile({
        name: profileName,
        phone: profilePhone,
        address: profileAddress,
        dateOfBirth: profileDOB,
        gender: profileGender as any,
        preferredLanguage: profileLanguage,
        preferredCurrency: profileCurrency,
        avatar: profileAvatar,
        passportNumber: profilePassport,
      });
    }
    setIsEditingProfile(false);
    setProfileSuccessMsg('Profile details updated successfully!');
    setTimeout(() => setProfileSuccessMsg(''), 3000);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!currentPass || !newPass || !confirmNewPass) {
      setPassError('All password fields are required.');
      return;
    }
    if (newPass !== confirmNewPass) {
      setPassError('New passwords do not match.');
      return;
    }
    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }

    setPassSuccess('Password updated securely!');
    setTimeout(() => {
      setIsChangePasswordOpen(false);
      setCurrentPass('');
      setNewPass('');
      setConfirmNewPass('');
      setPassSuccess('');
    }, 1500);
  };

  const handleDeleteAccountConfirm = () => {
    if (deleteConfirmText.toLowerCase() === 'delete') {
      if (onDeleteAccount) {
        onDeleteAccount();
      } else {
        alert('Account deleted successfully.');
        window.location.reload();
      }
    }
  };

  const filteredWishlist = wishlist.filter((item) => {
    if (wishlistCategory === 'all') return true;
    return item.type?.toLowerCase() === wishlistCategory || item.category?.toLowerCase() === wishlistCategory;
  });

  return (
    <div id="user-dashboard-module" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <UserAvatar
              src={user.avatar || profileAvatar}
              name={user.name}
              size="xl"
              showRing={true}
              ringColor="ring-orange-500/30"
              onClick={() => setIsAvatarModalOpen(true)}
            />
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="absolute inset-0 bg-slate-900/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-extrabold transition-opacity cursor-pointer gap-0.5"
              title="Change Profile Picture"
            >
              <Camera className="w-4 h-4 text-orange-400" />
              <span>Change</span>
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{user.name}</h2>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
                {user.tier} Member
              </span>
              <span className="bg-orange-100 text-orange-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-orange-200 capitalize">
                Role: {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user.email} • {user.phone}</p>
            <p className="text-[11px] font-mono text-slate-400">Passport: {user.passportNumber || 'N/A'}</p>
          </div>
        </div>

        {/* Quick Wallet Stats */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-center pr-4 border-r border-slate-200">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Voyage Wallet</span>
            <p className="text-xl font-extrabold text-orange-600">${user.walletBalance.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Loyalty Coins</span>
            <p className="text-xl font-extrabold text-amber-500 flex items-center gap-1 justify-center">
              <Coins className="w-5 h-5" /> {user.voyageCoins}
            </p>
          </div>
        </div>
      </div>

      {profileSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{profileSuccessMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Ticket className="w-4 h-4" /> My Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'wallet'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-4 h-4" /> Wallet &amp; Voyage Rewards
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" /> Saved Wishlist ({wishlist.length})
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> My Profile &amp; Security
        </button>
      </div>

      {/* Toast notification banner */}
      {dashboardToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-orange-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 max-w-md">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></div>
          <span className="text-xs font-bold text-slate-100">{dashboardToast}</span>
        </div>
      )}

      {/* 1. MY BOOKINGS TAB */}
      {activeTab === 'bookings' && (() => {
        // Use single source of truth for user's bookings
        const myBookings = bookings;

        const upcomingCount = myBookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending').length;
        const completedCount = myBookings.filter((b) => b.status === 'Completed').length;
        const cancelledCount = myBookings.filter((b) => b.status === 'Cancelled').length;
        const refundsCount = myBookings.filter((b) => b.status === 'Refunded' || b.paymentStatus === 'Refunded' || (b.status === 'Cancelled' && (b.paymentStatus === 'Refunded' || b.details?.cancellationReason))).length;

        const displayedBookings = myBookings.filter((b) => {
          if (bookingGroupFilter === 'all') return true;
          if (bookingGroupFilter === 'upcoming') return b.status === 'Confirmed' || b.status === 'Pending';
          if (bookingGroupFilter === 'completed') return b.status === 'Completed';
          if (bookingGroupFilter === 'cancelled') return b.status === 'Cancelled';
          if (bookingGroupFilter === 'refunds') return b.status === 'Refunded' || b.paymentStatus === 'Refunded' || (b.status === 'Cancelled' && (b.paymentStatus === 'Refunded' || b.details?.cancellationReason));
          return true;
        });

        return (
          <div className="space-y-6">
            {/* Filter Group Badges / Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setBookingGroupFilter('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    bookingGroupFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Bookings ({myBookings.length})
                </button>
                <button
                  onClick={() => setBookingGroupFilter('upcoming')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    bookingGroupFilter === 'upcoming'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Upcoming ({upcomingCount})
                </button>
                <button
                  onClick={() => setBookingGroupFilter('completed')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    bookingGroupFilter === 'completed'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed ({completedCount})
                </button>
                <button
                  onClick={() => setBookingGroupFilter('cancelled')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    bookingGroupFilter === 'cancelled'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Cancelled ({cancelledCount})
                </button>
                <button
                  onClick={() => setBookingGroupFilter('refunds')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    bookingGroupFilter === 'refunds'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refunds ({refundsCount})
                </button>
              </div>

              <div className="text-xs font-medium text-slate-500 pr-2">
                Showing <strong className="text-slate-800">{displayedBookings.length}</strong> of {myBookings.length} reservations
              </div>
            </div>

            {/* Empty State */}
            {displayedBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-xl mx-auto my-6">
                <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-orange-100 text-orange-500 flex items-center justify-center mx-auto shadow-inner">
                  <Ticket className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-lg">
                    {myBookings.length === 0
                      ? 'No bookings yet.'
                      : `No ${bookingGroupFilter} bookings found`}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {myBookings.length === 0
                      ? "You don't have any travel reservations yet. Explore our flights, hotels, packages, and activities to start your next adventure!"
                      : `You currently do not have any travel items categorized under '${bookingGroupFilter}'.`}
                  </p>
                </div>

                <div className="pt-2">
                  {myBookings.length === 0 ? (
                    <button
                      onClick={() => onSelectMode ? onSelectMode('flights') : undefined}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 inline-flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>Start Exploring</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setBookingGroupFilter('all')}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                    >
                      View All Bookings
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Booking Cards List */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {displayedBookings.map((b) => {
                  const image = getBookingImage(b);
                  const destination = getBookingDestination(b);
                  const payStatus = getPaymentStatus(b);

                  return (
                    <div
                      key={b.pnr}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all overflow-hidden flex flex-col justify-between"
                    >
                      {/* Card Header Banner */}
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={image}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2">
                          <span className="bg-slate-900/90 backdrop-blur-md text-orange-400 border border-orange-400/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            {b.type}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm backdrop-blur-md ${
                              b.status === 'Confirmed'
                                ? 'bg-emerald-500/90 text-white'
                                : b.status === 'Completed'
                                ? 'bg-blue-600/90 text-white'
                                : b.status === 'Cancelled'
                                ? 'bg-rose-600/90 text-white'
                                : b.status === 'Refunded'
                                ? 'bg-purple-600/90 text-white'
                                : 'bg-amber-500/90 text-white'
                            }`}>
                              {b.status}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md ${
                              payStatus === 'Paid'
                                ? 'bg-slate-900/80 text-emerald-400 border border-emerald-400/40'
                                : payStatus === 'Refunded'
                                ? 'bg-slate-900/80 text-purple-300 border border-purple-400/40'
                                : 'bg-slate-900/80 text-amber-300 border border-amber-400/40'
                            }`}>
                              {payStatus}
                            </span>
                          </div>
                        </div>

                        {/* Destination & Title Overlay */}
                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <div className="flex items-center gap-1 text-xs text-orange-300 font-extrabold">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{destination}</span>
                          </div>
                          <h4 className="font-extrabold text-lg text-white drop-shadow-sm leading-tight truncate mt-0.5">
                            {b.title}
                          </h4>
                        </div>
                      </div>

                      {/* Card Details Body */}
                      <div className="p-5 space-y-4 flex-1">
                        <p className="text-xs text-slate-600 line-clamp-1 font-medium">{b.subtitle}</p>

                        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                          <div>
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Booking ID / PNR</span>
                            <span className="font-mono font-bold text-slate-800">{b.id}</span>
                            <span className="text-[10px] text-slate-500 block font-mono">PNR: {b.pnr}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Travel Date</span>
                            <span className="font-bold text-slate-800">{b.travelDate}</span>
                            <span className="text-[10px] text-slate-500 block">Booked: {b.bookingDate}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Passenger</span>
                            <span className="font-bold text-slate-800">{b.passengerName}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Fare</span>
                            <span className="text-base font-extrabold text-orange-600">${b.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions Footer */}
                      <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setSelectedBookingDetails(b)}
                            className="py-2 px-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-extrabold rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5 text-orange-400" />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={async () => {
                              try {
                                const r = await fetchBookingReceipt(b.pnr || b.id);
                                downloadReceiptPDF(r);
                                showToast(`Receipt PDF (PNR: ${b.pnr}) downloaded successfully!`);
                              } catch (err: any) {
                                showToast(err.message || 'Receipt is not available.');
                              }
                            }}
                            className="py-2 px-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-blue-600" />
                            <span>Receipt PDF</span>
                          </button>

                          <button
                            onClick={() => setInvoiceBooking(b)}
                            className="py-2 px-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Invoice</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 font-medium">
                          {(b.status === 'Confirmed' || b.status === 'Pending') ? (
                            <>
                              <button
                                onClick={() => setModifyBooking(b)}
                                className="text-slate-600 hover:text-orange-600 font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Modify Date/Seat</span>
                              </button>

                              <button
                                onClick={() => setCancelConfirmBooking(b)}
                                className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Cancel Booking</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-400 text-[10px]">
                              {b.status === 'Completed' ? 'Trip Completed' : 'Booking Cancelled'}
                            </span>
                          )}

                          <button
                            onClick={() => setSupportBooking(b)}
                            className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Support</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* 2. WALLET & REWARDS TAB */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 p-6 rounded-3xl text-white space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">Voyage Digital Pass</span>
              <Wallet className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Available Balance</p>
              <p className="text-3xl font-extrabold text-white">${user.walletBalance.toFixed(2)}</p>
            </div>
            <div className="pt-4 border-t border-slate-700/80 flex justify-between items-center text-xs">
              <span className="text-slate-300 font-mono">**** **** 9081</span>
              <span className="bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px]">{user.tier}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs md:col-span-2">
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-500" /> Refer &amp; Earn Voyage Credit
            </h4>
            <p className="text-xs text-slate-600">
              Share your referral code with friends. When they book their first trip, you both receive $25 Voyage Credit + 250 Loyalty Coins!
            </p>
            <div className="flex items-center gap-2 max-w-md">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800">
                ALEX-REF25
              </div>
              <button
                onClick={handleCopyReferral}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-800 text-base">Saved Bucket List Items</h3>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
              {['all', 'flight', 'hotel', 'experience'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setWishlistCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold capitalize transition-all ${
                    wishlistCategory === cat ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredWishlist.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-2">
              <Heart className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700">No saved items in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredWishlist.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs relative group">
                  <img src={item.image || item.logo} alt={item.name || item.airline} className="w-full h-36 object-cover" />
                  <button
                    onClick={() => onRemoveWishlist(item.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-rose-500 shadow-xs"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>
                  <div className="p-4 space-y-2">
                    <h4 className="font-extrabold text-slate-900 text-sm truncate">{item.name || item.title || item.airline}</h4>
                    <p className="text-xs text-slate-500 truncate">{item.location || item.subtitle || item.fromCity}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="font-extrabold text-orange-600 text-sm">${item.price}</span>
                      <button className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-xl">Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. MY PROFILE & SECURITY TAB */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* User Profile Form & Management */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" /> User Profile Information
                </h3>
                <p className="text-xs text-slate-500">Manage your personal information, address, and preferences</p>
              </div>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-4 py-2 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 font-bold text-xs flex items-center gap-1.5 border border-orange-200"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditingProfile ? 'Cancel Editing' : 'Edit Profile'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium disabled:opacity-75 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  disabled={!isEditingProfile}
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium disabled:opacity-75 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Passport Number</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={profilePassport}
                  onChange={(e) => setProfilePassport(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium disabled:opacity-75 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  disabled={!isEditingProfile}
                  value={profileDOB}
                  onChange={(e) => setProfileDOB(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium disabled:opacity-75 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                <select
                  disabled={!isEditingProfile}
                  value={profileGender}
                  onChange={(e) => setProfileGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium disabled:opacity-75 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Language</label>
                <select
                  disabled={!isEditingProfile}
                  value={profileLanguage}
                  onChange={(e) => setProfileLanguage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium disabled:opacity-75 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option>English (US)</option>
                  <option>Spanish (Español)</option>
                  <option>French (Français)</option>
                  <option>German (Deutsch)</option>
                  <option>Japanese (日本語)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Currency</label>
                <select
                  disabled={!isEditingProfile}
                  value={profileCurrency}
                  onChange={(e) => setProfileCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium disabled:opacity-75 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>AUD ($)</option>
                  <option>JPY (¥)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium disabled:opacity-75 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {isEditingProfile && (
                <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Security & Password Actions */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Security Controls
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <strong className="text-xs font-extrabold text-slate-800 block">Change Account Password</strong>
                <span className="text-xs text-slate-500">Update your account password regularly to maintain maximum security</span>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <KeyRound className="w-4 h-4 text-orange-400" /> Change Password
              </button>
            </div>

            {/* Active Sessions List */}
            <div className="space-y-3 pt-2">
              <strong className="text-xs font-extrabold text-slate-800 block">Active Device Sessions</strong>
              {activeSessions.map((sess) => (
                <div key={sess.id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-800">{sess.device}</strong>
                        {sess.current && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2 py-0.2 rounded-full">
                            THIS DEVICE
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">IP: {sess.ip} • {sess.date}</span>
                    </div>
                  </div>

                  {!sess.current && (
                    <button
                      onClick={() => handleTerminateSession(sess.id)}
                      className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Terminate Session
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Danger Zone: Delete Account */}
            <div className="pt-4 border-t border-rose-100 space-y-2">
              <strong className="text-xs font-extrabold text-rose-600 uppercase tracking-wider block">Danger Zone</strong>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-200">
                <div>
                  <strong className="text-xs font-extrabold text-slate-800 block">Delete Account</strong>
                  <span className="text-xs text-slate-500">Permanently delete your VoyageGo account, bookings, and wallet balance.</span>
                </div>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-orange-500" /> Change Password
            </h3>

            {passError && <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl">{passError}</p>}
            {passSuccess && <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl">{passSuccess}</p>}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmNewPass}
                  onChange={(e) => setConfirmNewPass(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-xs"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-rose-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-slate-900 text-lg">Are you absolutely sure?</h3>
            <p className="text-xs text-slate-500">
              This action cannot be undone. This will permanently delete your VoyageGo account, cancel active bookings, and forfeit any remaining wallet balance (${user.walletBalance.toFixed(2)}).
            </p>

            <div className="text-left bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Type <strong className="text-rose-600">delete</strong> to confirm:
              </label>
              <input
                type="text"
                placeholder="delete"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-bold text-rose-600"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmText.toLowerCase() !== 'delete'}
                onClick={handleDeleteAccountConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 disabled:opacity-50 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E-Ticket Printable Modal */}
      {ticketModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border-t-8 border-orange-500">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest">OFFICIAL BOARDING PASS / VOUCHER</span>
                <h3 className="font-extrabold text-slate-900 text-lg">VoyageGo Confirmation</h3>
              </div>
              <button onClick={() => setTicketModalBooking(null)} className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-500 cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-slate-600">PNR: {ticketModalBooking.pnr}</span>
                <span className="text-xs font-bold text-emerald-600">✓ VERIFIED</span>
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-base">{ticketModalBooking.title}</p>
                <p className="text-xs text-slate-600">{ticketModalBooking.subtitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-medium pt-2 border-t border-slate-200/60">
                <span>Passenger: <strong>{ticketModalBooking.passengerName}</strong></span>
                <span>Travel Date: <strong>{ticketModalBooking.travelDate}</strong></span>
              </div>
            </div>

            {/* Simulated QR Code */}
            <div className="flex flex-col items-center justify-center p-4 bg-white border border-dashed border-slate-300 rounded-2xl space-y-2">
              <QrCode className="w-24 h-24 text-slate-800" />
              <p className="text-[10px] font-mono text-slate-400">{ticketModalBooking.qrCodeData}</p>
            </div>

            <button
              onClick={async () => {
                try {
                  const r = await fetchBookingReceipt(ticketModalBooking.pnr || ticketModalBooking.id);
                  downloadReceiptPDF(r);
                  showToast(`PDF Receipt & Voucher (PNR: ${ticketModalBooking.pnr}) downloaded!`);
                } catch (err: any) {
                  showToast(err.message || 'Receipt is not available.');
                }
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download PDF Receipt
            </button>
          </div>
        </div>
      )}

      {/* View Booking Details Modal */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider">BOOKING SUMMARY &amp; ITINERARY</span>
                <h3 className="font-extrabold text-slate-900 text-lg">{selectedBookingDetails.title}</h3>
                <p className="text-xs text-slate-500">{selectedBookingDetails.subtitle}</p>
              </div>
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-medium">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Booking ID</span>
                  <span className="font-mono font-bold text-slate-800">{selectedBookingDetails.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">PNR Number</span>
                  <span className="font-mono font-bold text-orange-600">{selectedBookingDetails.pnr}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Booking Date</span>
                  <span className="text-slate-800 font-bold">{selectedBookingDetails.bookingDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Travel Date</span>
                  <span className="text-slate-800 font-bold">{selectedBookingDetails.travelDate}</span>
                </div>
              </div>

              <div className="bg-orange-50/50 p-3.5 rounded-2xl border border-orange-100 space-y-1.5">
                <span className="text-[10px] font-extrabold text-orange-700 uppercase tracking-wider block">Passenger &amp; Contact Info</span>
                <div className="grid grid-cols-2 gap-2 text-slate-700 font-medium">
                  <div>Name: <strong className="text-slate-900">{selectedBookingDetails.passengerName}</strong></div>
                  <div>Phone: <strong className="text-slate-900">{selectedBookingDetails.passengerPhone || user.phone}</strong></div>
                  <div className="col-span-2">Email: <strong className="text-slate-900">{selectedBookingDetails.passengerEmail || user.email}</strong></div>
                </div>
              </div>

              {selectedBookingDetails.details && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Reservation Breakdown</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 font-medium">
                    {selectedBookingDetails.details.seatNumber && <div>Seat / Room: <strong>{selectedBookingDetails.details.seatNumber}</strong></div>}
                    {selectedBookingDetails.details.gate && <div>Boarding Gate: <strong>{selectedBookingDetails.details.gate}</strong></div>}
                    {selectedBookingDetails.details.flightClass && <div>Class: <strong>{selectedBookingDetails.details.flightClass}</strong></div>}
                    {selectedBookingDetails.details.baggageAllowance && <div>Baggage: <strong>{selectedBookingDetails.details.baggageAllowance}</strong></div>}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center p-3.5 bg-slate-900 text-white rounded-2xl">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Amount Paid</span>
                  <span className="text-xs text-emerald-400 font-extrabold">Status: {getPaymentStatus(selectedBookingDetails)}</span>
                </div>
                <span className="text-xl font-extrabold text-orange-400">${selectedBookingDetails.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setTicketModalBooking(selectedBookingDetails);
                  setSelectedBookingDetails(null);
                }}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <QrCode className="w-4 h-4" /> View Boarding Pass
              </button>
              <button
                onClick={async () => {
                  try {
                    const r = await fetchBookingReceipt(selectedBookingDetails.pnr || selectedBookingDetails.id);
                    downloadReceiptPDF(r);
                    showToast(`Receipt PDF (PNR: ${selectedBookingDetails.pnr}) downloaded!`);
                    setSelectedBookingDetails(null);
                  } catch (err: any) {
                    showToast(err.message || 'Receipt is not available.');
                  }
                }}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download PDF Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">TAX INVOICE</span>
                  <h3 className="font-extrabold text-slate-900 text-base">Invoice #{invoiceBooking.pnr}-INV</h3>
                </div>
              </div>
              <button onClick={() => setInvoiceBooking(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-slate-500 cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Billed To:</span>
                <strong className="text-slate-900">{user.name}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Invoice Date:</span>
                <strong className="text-slate-900">{invoiceBooking.bookingDate}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Status:</span>
                <strong className="text-emerald-600 uppercase font-extrabold">{getPaymentStatus(invoiceBooking)}</strong>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-600">{invoiceBooking.type} Fare</span>
                  <span className="font-bold text-slate-800">${(invoiceBooking.amount * 0.88).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">GST &amp; Taxes (12%)</span>
                  <span className="font-bold text-slate-800">${(invoiceBooking.amount * 0.12).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                  <span>Total Amount Paid</span>
                  <span className="text-orange-600">${invoiceBooking.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={async () => {
                  try {
                    const r = await fetchBookingReceipt(invoiceBooking.pnr || invoiceBooking.id);
                    downloadReceiptPDF(r);
                    showToast(`Receipt PDF (PNR: ${invoiceBooking.pnr}) downloaded successfully!`);
                    setInvoiceBooking(null);
                  } catch (err: any) {
                    showToast(err.message || 'Receipt is not available.');
                  }
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" /> Download PDF Receipt
              </button>
              <button
                onClick={async () => {
                  try {
                    const r = await fetchBookingReceipt(invoiceBooking.pnr || invoiceBooking.id);
                    triggerPrintReceipt(r);
                  } catch (err: any) {
                    showToast(err.message || 'Receipt is not available.');
                  }
                }}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirmBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-rose-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-lg">Cancel Reservation?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to cancel booking <strong className="text-slate-800 font-mono">{cancelConfirmBooking.pnr}</strong> ({cancelConfirmBooking.title})?
              </p>
            </div>

            <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-100 text-xs space-y-1 text-rose-950 font-medium">
              <div className="flex justify-between">
                <span>Original Fare:</span>
                <strong>${cancelConfirmBooking.amount.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Cancellation Fee:</span>
                <strong className="text-emerald-700">$0.00 (Zero Fee)</strong>
              </div>
              <div className="flex justify-between text-rose-900 font-bold pt-1 border-t border-rose-200/60">
                <span>Eligible Refund:</span>
                <strong className="text-emerald-700">${cancelConfirmBooking.amount.toFixed(2)}</strong>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancelConfirmBooking(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  onCancelBooking(cancelConfirmBooking.pnr);
                  showToast(`Booking ${cancelConfirmBooking.pnr} cancelled. Refund processed to your original payment mode.`);
                  setCancelConfirmBooking(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modify Booking Modal */}
      {modifyBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-orange-500" />
                <h3 className="font-extrabold text-slate-900 text-base">Modify Reservation</h3>
              </div>
              <button onClick={() => setModifyBooking(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-slate-500 cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <strong className="text-slate-900 block font-bold">{modifyBooking.title}</strong>
                <span className="text-slate-500 font-mono text-[10px]">PNR: {modifyBooking.pnr} • Current Date: {modifyBooking.travelDate}</span>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Select New Travel Date</label>
                <input
                  type="date"
                  value={modifyNewDate}
                  onChange={(e) => setModifyNewDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Special Seat / Room Request</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Request window seat or late check-in..."
                  value={modifySpecialRequest}
                  onChange={(e) => setModifySpecialRequest(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setModifyBooking(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (modifyBooking) {
                    if (onUpdateBooking && (modifyNewDate || modifySpecialRequest)) {
                      onUpdateBooking({
                        ...modifyBooking,
                        travelDate: modifyNewDate || modifyBooking.travelDate,
                        details: {
                          ...modifyBooking.details,
                          specialRequest: modifySpecialRequest || modifyBooking.details?.specialRequest,
                        },
                      });
                    }
                    showToast(`Modification request submitted for PNR: ${modifyBooking.pnr}! Travel date updated.`);
                  }
                  setModifyBooking(null);
                  setModifyNewDate('');
                  setModifySpecialRequest('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-sm cursor-pointer"
              >
                Submit Modification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {supportBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                <h3 className="font-extrabold text-slate-900 text-base">Contact Support</h3>
              </div>
              <button onClick={() => setSupportBooking(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-slate-500 cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Regarding Reservation</span>
                <strong className="text-slate-900 block font-bold">{supportBooking.title}</strong>
                <span className="text-slate-500 font-mono text-[10px]">PNR: {supportBooking.pnr}</span>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Inquiry Category</label>
                <select
                  value={supportInquiryType}
                  onChange={(e) => setSupportInquiryType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                >
                  <option value="Flight/Hotel Reschedule">Flight/Hotel Reschedule</option>
                  <option value="Baggage / Special Meal Request">Baggage / Special Meal Request</option>
                  <option value="Refund Query">Refund Query</option>
                  <option value="Name Correction">Name Correction</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Message to Concierge</label>
                <textarea
                  rows={3}
                  placeholder="Describe how we can assist you..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSupportBooking(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast(`Support ticket created for PNR: ${supportBooking.pnr}. An agent will respond within 15 minutes!`);
                  setSupportBooking(null);
                  setSupportMessage('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Send Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Picture Manager Modal */}
      <ProfilePictureModal
        isOpen={isAvatarModalOpen}
        currentAvatar={profileAvatar || user.avatar}
        userName={user.name}
        userEmail={user.email}
        onClose={() => setIsAvatarModalOpen(false)}
        onSaveAvatar={(newAvatarUrl) => {
          setProfileAvatar(newAvatarUrl);
          if (onUpdateUserProfile) {
            onUpdateUserProfile({ avatar: newAvatarUrl });
          }
          showToast('Profile picture updated successfully!');
        }}
      />
    </div>
  );
};
