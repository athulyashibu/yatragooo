import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Ban,
  Shield,
  KeyRound,
  Wallet,
  Coins,
  History,
  FileText,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Award,
  CreditCard,
  Edit3,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Camera,
} from 'lucide-react';
import { ComprehensiveUser, Booking } from '../../types';
import { ProfilePictureModal } from '../profile/ProfilePictureModal';
import { UserAvatar } from '../common/UserAvatar';

interface AdminUserProfileModalProps {
  user: ComprehensiveUser;
  userBookings: Booking[];
  onClose: () => void;
  onUpdateUser: (updatedUser: ComprehensiveUser) => void;
  onSelectBooking: (booking: Booking) => void;
  onShowToast: (msg: string) => void;
}

export const AdminUserProfileModal: React.FC<AdminUserProfileModalProps> = ({
  user,
  userBookings,
  onClose,
  onUpdateUser,
  onSelectBooking,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'actions' | 'loginHistory'>('overview');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');

  // Edit User State
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editTier, setEditTier] = useState(user.tier);
  const [editAddress, setEditAddress] = useState(user.address);
  const [editStatus, setEditStatus] = useState(user.accountStatus);

  // Coins adjustment state
  const [showCoinsModal, setShowCoinsModal] = useState(false);
  const [coinsAmount, setCoinsAmount] = useState(500);
  const [coinsAction, setCoinsAction] = useState<'add' | 'remove'>('add');

  // Wallet adjustment state
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAmount, setWalletAmount] = useState(100);

  // Avatar Management Modal
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Filter bookings for this user
  const filteredBookings = userBookings.filter((b) => {
    const matchesType = typeFilter === 'All' || b.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || b.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPayment = paymentFilter === 'All' || (b.paymentStatus && b.paymentStatus.toLowerCase() === paymentFilter.toLowerCase());
    return matchesType && matchesStatus && matchesPayment;
  });

  const handleToggleSuspend = () => {
    const nextStatus = user.accountStatus === 'Active' ? 'Suspended' : 'Active';
    const updated = { ...user, accountStatus: nextStatus as any };
    onUpdateUser(updated);
    onShowToast(`User ${user.name} (${user.id}) status changed to ${nextStatus}.`);
  };

  const handleSaveUserEdits = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: editName,
      email: editEmail,
      phone: editPhone,
      tier: editTier,
      address: editAddress,
      accountStatus: editStatus,
    };
    onUpdateUser(updated);
    setIsEditingUser(false);
    onShowToast(`User profile updated successfully.`);
  };

  const handleAdjustCoins = () => {
    const current = user.voyageCoins || 0;
    const newCoins = coinsAction === 'add' ? current + Number(coinsAmount) : Math.max(0, current - Number(coinsAmount));
    const updated = { ...user, voyageCoins: newCoins };
    onUpdateUser(updated);
    setShowCoinsModal(false);
    onShowToast(`${coinsAction === 'add' ? 'Added' : 'Removed'} ${coinsAmount} Voyage Coins. New balance: ${newCoins}`);
  };

  const handleResetWallet = (newBalance: number) => {
    const updated = { ...user, walletBalance: newBalance };
    onUpdateUser(updated);
    setShowWalletModal(false);
    onShowToast(`Wallet balance updated to $${newBalance.toFixed(2)}.`);
  };

  const handleResetPassword = () => {
    onShowToast(`Password reset link sent to ${user.email}. Temporary token generated.`);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header Drawer Banner */}
        <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
              <UserAvatar
                src={user.avatar}
                name={user.name}
                size="xl"
                showRing={true}
                ringColor="ring-orange-500/50"
              />
              <div
                className="absolute inset-0 bg-slate-900/70 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-extrabold transition-opacity"
                title="Admin: Change / Reset User Avatar"
              >
                <Camera className="w-4 h-4 text-orange-400" />
                <span>Change</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-orange-400 bg-orange-950 px-2 py-0.5 rounded-md font-bold">
                  {user.id}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    user.accountStatus === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {user.accountStatus}
                </span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" /> {user.tier} Tier
                </span>
              </div>
              <h2 className="text-2xl font-black mt-1 text-white">{user.name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                <span>{user.email}</span> • <span>{user.phone}</span> • <span>Registered: {user.registrationDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={handleToggleSuspend}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                user.accountStatus === 'Active'
                  ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {user.accountStatus === 'Active' ? (
                <>
                  <Ban className="w-3.5 h-3.5 text-rose-400" /> Suspend User
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Activate User
                </>
              )}
            </button>
            <button
              onClick={() => setIsEditingUser(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-orange-400" /> Edit User
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview' ? 'bg-white text-orange-600 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Basic Info &amp; Travel Stats
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'bookings' ? 'bg-white text-orange-600 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Booking History ({userBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'actions' ? 'bg-white text-orange-600 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin Actions &amp; Wallet
            </button>
            <button
              onClick={() => setActiveTab('loginHistory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'loginHistory' ? 'bg-white text-orange-600 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Security &amp; Login Logs
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: BASIC INFO & TRAVEL STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Travel Statistics Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Total Bookings</p>
                  <p className="text-2xl font-black text-slate-900">{user.travelStats?.totalBookings || userBookings.length}</p>
                  <p className="text-[10px] text-emerald-600 font-bold">Confirmed / Active</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Total Spending</p>
                  <p className="text-2xl font-black text-slate-900">${(user.travelStats?.totalSpending || userBookings.reduce((sum, b) => sum + b.amount, 0)).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Lifetime Revenue</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                  <p className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5 text-emerald-500" /> Wallet Balance
                  </p>
                  <p className="text-2xl font-black text-emerald-600">${user.walletBalance.toFixed(2)}</p>
                  <button onClick={() => setShowWalletModal(true)} className="text-[10px] text-orange-600 hover:underline font-bold">
                    Adjust Wallet
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                  <p className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-500" /> Voyage Coins
                  </p>
                  <p className="text-2xl font-black text-amber-600">{user.voyageCoins.toLocaleString()}</p>
                  <button onClick={() => setShowCoinsModal(true)} className="text-[10px] text-orange-600 hover:underline font-bold">
                    Add / Deduct
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Countries Visited</p>
                  <p className="text-2xl font-black text-slate-900">{user.travelStats?.countriesVisited || 3}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{user.travelStats?.citiesVisited || 6} Cities</p>
                </div>
              </div>

              {/* Basic Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-500" /> Profile &amp; Contact Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">User ID</span>
                      <span className="font-mono font-bold text-slate-900">{user.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Full Name</span>
                      <span className="font-bold text-slate-900">{user.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Email Address</span>
                      <span className="font-mono font-medium text-slate-800">{user.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Phone Number</span>
                      <span className="font-mono font-medium text-slate-800">{user.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Gender</span>
                      <span className="font-medium text-slate-800">{user.gender || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Date of Birth</span>
                      <span className="font-medium text-slate-800">{user.dateOfBirth || '1995-05-12'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" /> Geography &amp; Account Status
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="col-span-2">
                      <span className="text-slate-400 font-medium block">Residential Address</span>
                      <span className="font-medium text-slate-800">{user.address || '42 MG Road, Bengaluru, India'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Country</span>
                      <span className="font-bold text-slate-900">{user.country || 'India'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Membership Tier</span>
                      <span className="font-bold text-amber-600">{user.tier} Member</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Registration Date</span>
                      <span className="font-mono font-medium text-slate-700">{user.registrationDate || '2025-11-15'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Last Login</span>
                      <span className="font-mono font-medium text-slate-700">{user.lastLogin || '2026-08-02 21:45'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPLETE BOOKING HISTORY */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {/* Filters Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-700">
                  <Filter className="w-4 h-4 text-orange-500" /> Filter Booking History:
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-medium text-slate-700"
                  >
                    <option value="All">All Types</option>
                    <option value="Flight">Flights</option>
                    <option value="Hotel">Hotels</option>
                    <option value="Train">Trains</option>
                    <option value="Bus">Buses</option>
                    <option value="Cab">Cabs</option>
                    <option value="Experience">Experiences</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-medium text-slate-700"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                  </select>

                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-medium text-slate-700"
                  >
                    <option value="All">All Payments</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Bookings Table */}
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
                  <p className="text-xs font-bold text-slate-500">No bookings match the selected filters for this user.</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                          <th className="p-3">Booking ID / PNR</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Title / Service</th>
                          <th className="p-3">Travel Date</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-mono font-bold text-slate-900">
                              <div>{b.pnr}</div>
                              <div className="text-[10px] text-slate-400">{b.id}</div>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                {b.type}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-slate-800">{b.title}</div>
                              <div className="text-[10px] text-slate-400">{b.subtitle}</div>
                            </td>
                            <td className="p-3 font-mono text-slate-600">{b.travelDate}</td>
                            <td className="p-3 font-bold text-slate-900">${b.amount.toFixed(2)}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  b.paymentStatus === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : b.paymentStatus === 'Refunded'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {b.paymentStatus || 'Paid'}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  b.status === 'Confirmed'
                                    ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                                    : b.status === 'Completed'
                                    ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
                                    : 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => onSelectBooking(b)}
                                className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold rounded-lg border border-orange-200 transition-colors flex items-center gap-1 ml-auto text-[11px]"
                              >
                                Inspection <ChevronRight className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADMIN ACTIONS & WALLET */}
          {activeTab === 'actions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Wallet className="w-4.5 h-4.5 text-orange-500" /> Wallet &amp; Voyage Coins Controls
                </h3>
                <p className="text-xs text-slate-500">Manually issue refunds, credit customer wallet, or adjust reward coins for user {user.name}.</p>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Current Wallet Balance</span>
                      <span className="text-xl font-black text-emerald-600">${user.walletBalance.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => setShowWalletModal(true)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                    >
                      Update Wallet
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Current Voyage Coins</span>
                      <span className="text-xl font-black text-amber-600">{user.voyageCoins.toLocaleString()} Coins</span>
                    </div>
                    <button
                      onClick={() => setShowCoinsModal(true)}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs"
                    >
                      Adjust Coins
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <KeyRound className="w-4.5 h-4.5 text-orange-500" /> Security &amp; Administrative Actions
                </h3>
                <p className="text-xs text-slate-500">Perform direct system security interventions on this user account.</p>

                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={handleResetPassword}
                    className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-orange-500" /> Reset Password &amp; Dispatch Security Token
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={handleToggleSuspend}
                    className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Ban className="w-4 h-4 text-rose-500" /> {user.accountStatus === 'Active' ? 'Suspend Account Access' : 'Reactivate Account'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleResetWallet(0)}
                    className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-rose-600 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-rose-500" /> Reset Wallet Balance to $0.00
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & LOGIN LOGS */}
          {activeTab === 'loginHistory' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs space-y-3">
              <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <History className="w-4 h-4 text-orange-400" /> Access &amp; Authentication History
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Total Recorded Sessions: {user.loginHistory?.length || 3}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Device &amp; Browser</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Authentication Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {(user.loginHistory || [
                      { id: 'l1', timestamp: '2026-08-02 21:45', ipAddress: '103.21.124.89', device: 'Chrome on macOS', location: 'Bengaluru, India', status: 'Success' },
                      { id: 'l2', timestamp: '2026-07-28 14:10', ipAddress: '103.21.124.89', device: 'VoyageGo iOS App v4.2', location: 'Bengaluru, India', status: 'Success' },
                    ]).map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3 text-slate-900 font-bold">{log.timestamp}</td>
                        <td className="p-3 text-slate-700">{log.ipAddress}</td>
                        <td className="p-3 text-slate-800 font-sans">{log.device}</td>
                        <td className="p-3 text-slate-600 font-sans">{log.location}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              log.status === 'Success'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* MODAL 1: Edit User Profile Modal */}
        {isEditingUser && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base">Edit User Profile: {user.name}</h3>
                <button onClick={() => setIsEditingUser(false)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>
              <form onSubmit={handleSaveUserEdits} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone</label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Membership Tier</label>
                    <select
                      value={editTier}
                      onChange={(e) => setEditTier(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold text-amber-600"
                    >
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Account Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold"
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingUser(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: Adjust Voyage Coins Modal */}
        {showCoinsModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="font-extrabold text-slate-900 text-base">Adjust Voyage Coins</h3>
              <div className="space-y-3 text-xs">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCoinsAction('add')}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                      coinsAction === 'add' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    + Add Coins
                  </button>
                  <button
                    onClick={() => setCoinsAction('remove')}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                      coinsAction === 'remove' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    - Deduct Coins
                  </button>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Coin Amount</label>
                  <input
                    type="number"
                    value={coinsAmount}
                    onChange={(e) => setCoinsAmount(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono text-base font-bold"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowCoinsModal(false)}
                    className="px-3 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdjustCoins}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl"
                  >
                    Apply Adjustment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: Update Wallet Balance Modal */}
        {showWalletModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="font-extrabold text-slate-900 text-base">Set User Wallet Balance</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">New Balance ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono text-base font-bold text-emerald-600"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowWalletModal(false)}
                    className="px-3 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleResetWallet(Number(walletAmount))}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                  >
                    Save Wallet Balance
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Profile Picture Admin Management Modal */}
        <ProfilePictureModal
          isOpen={isAvatarModalOpen}
          currentAvatar={user.avatar}
          userName={user.name}
          userEmail={user.email}
          title="Admin Profile Picture Management"
          subtitle={`Manage or reset profile picture for ${user.name}`}
          onClose={() => setIsAvatarModalOpen(false)}
          onSaveAvatar={(newAvatarUrl) => {
            const updated = { ...user, avatar: newAvatarUrl };
            onUpdateUser(updated);
            onShowToast(`Updated profile picture for ${user.name}`);
          }}
        />
      </div>
    </div>
  );
};
