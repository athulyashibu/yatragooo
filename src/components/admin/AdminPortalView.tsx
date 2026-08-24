import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Ticket,
  Users,
  Building,
  Plane,
  Tag,
  Plus,
  RefreshCw,
  Search,
  FileText,
  UserCheck,
  Bell,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Lock,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Ban,
  Calendar,
  Layers,
  HelpCircle,
  Clock,
  LogOut,
  Sparkles,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';
import { AdminMetrics, Booking, Coupon, AuditLogItem, SupportTicket, UserProfile, ComprehensiveUser } from '../../types';
import { AdminUserProfileModal } from './AdminUserProfileModal';
import { AdminBookingDetailModal } from './AdminBookingDetailModal';
import { AdminLoginModal } from './AdminLoginModal';
import { AdminHeaderDomainBar } from './AdminHeaderDomainBar';

interface AdminPortalViewProps {
  metrics: AdminMetrics;
  bookings: Booking[];
  coupons: Coupon[];
  user?: UserProfile | null;
  onAddCoupon: (coupon: Coupon) => void;
  onUpdateBookingStatus: (pnr: string, status: 'Confirmed' | 'Cancelled' | 'Refunded') => void;
  onUpdateBooking?: (updatedBooking: Booking) => void;
  onSendNotification?: (title: string, message: string, type: 'info' | 'promo' | 'alert') => void;
  initialTab?: 'overview' | 'users' | 'bookings' | 'coupons' | 'audit' | 'roles' | 'broadcast' | 'support';
  onSwitchDomain?: (domain: 'voyagego.com' | 'admin.voyagego.com') => void;
  currentDomain?: 'voyagego.com' | 'admin.voyagego.com';
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  metrics,
  bookings,
  coupons,
  user,
  onAddCoupon,
  onUpdateBookingStatus,
  onUpdateBooking,
  onSendNotification,
  initialTab = 'overview',
  onSwitchDomain,
  currentDomain = 'admin.voyagego.com',
}) => {
  // Authentication & Security State
  const [adminUser, setAdminUser] = useState<UserProfile | null>(() => {
    if (user && user.role === 'admin') return user;
    try {
      const savedAdmin = localStorage.getItem('voyagego_admin_user');
      if (savedAdmin) return JSON.parse(savedAdmin);
    } catch {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      setAdminUser(user);
    }
  }, [user]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bookings' | 'coupons' | 'audit' | 'roles' | 'broadcast' | 'support'>(initialTab);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // User Directory & Search State (Synchronized with Shared PostgreSQL Database)
  const [userList, setUserList] = useState<ComprehensiveUser[]>([]);
  const [masterBookings, setMasterBookings] = useState<Booking[]>(bookings || []);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<ComprehensiveUser | null>(null);

  // Sync with production database APIs
  const fetchLiveDatabaseData = async () => {
    setIsSyncing(true);
    const token = localStorage.getItem('voyagego_admin_token');
    const authHeaders: Record<string, string> = {};
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
      const [uRes, bRes, aRes] = await Promise.all([
        fetch('/api/admin/users', { headers: authHeaders }),
        fetch('/api/admin/bookings', { headers: authHeaders }),
        fetch('/api/admin/audit-logs', { headers: authHeaders }),
      ]);

      if (uRes.ok) {
        const uJson = await uRes.json();
        if (uJson.users && Array.isArray(uJson.users)) {
          setUserList(uJson.users);
        }
      }

      if (bRes.ok) {
        const bJson = await bRes.json();
        if (bJson.bookings && Array.isArray(bJson.bookings)) {
          setMasterBookings(bJson.bookings);
        }
      }

      if (aRes.ok) {
        const aJson = await aRes.json();
        if (aJson.logs && Array.isArray(aJson.logs)) {
          setAuditLogs(aJson.logs);
        }
      }
    } catch (err) {
      console.warn('Production DB auto-sync notice:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchLiveDatabaseData();
    const interval = setInterval(fetchLiveDatabaseData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Booking Inspector State
  const [selectedBookingForInspect, setSelectedBookingForInspect] = useState<Booking | null>(null);

  // Bookings Queue Filters & Pagination
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed' | 'Refunded'>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Coupon Generator State
  const [couponCode, setCouponCode] = useState('');
  const [discountVal, setDiscountVal] = useState(20);
  const [couponDesc, setCouponDesc] = useState('');

  // Notification Broadcast State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'info' | 'promo' | 'alert'>('promo');
  const [broadcastSentSuccess, setBroadcastSentSuccess] = useState(false);

  // Support Tickets State
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    { id: 'TCK-9901', customerName: 'Athulya Shibu', email: 'athulya@gmail.com', subject: 'Flight Reschedule Request (EK-502)', category: 'Booking', priority: 'High', status: 'Open', createdAt: '2026-08-02 14:20' },
    { id: 'TCK-9902', email: 'mark.t@example.com', customerName: 'Mark Taylor', subject: 'Refund delay for cancelled hotel stay', category: 'Refund', priority: 'Medium', status: 'In Progress', createdAt: '2026-08-01 09:15' },
    { id: 'TCK-9903', email: 'lisa.w@example.com', customerName: 'Lisa White', subject: 'Voyage Coins reward points missing', category: 'General', priority: 'Low', status: 'Resolved', createdAt: '2026-07-30 18:40' },
  ]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    { id: 'log-101', timestamp: '2026-08-02 22:50', user: 'Alex Mercer (Admin)', action: 'ADMIN_LOGIN_SUCCESS', category: 'auth', ipAddress: '192.168.1.104', device: 'Chrome macOS', status: 'success' },
    { id: 'log-102', timestamp: '2026-08-02 21:04', user: 'Alex Mercer (Admin)', action: 'COUPON_CREATED', category: 'admin', ipAddress: '192.168.1.104', device: 'Chrome macOS', status: 'success' },
    { id: 'log-103', timestamp: '2026-08-02 20:15', user: 'System / User Request', action: 'BOOKING_CANCELLED', category: 'booking', ipAddress: '103.21.124.89', device: 'Customer API', status: 'success' },
    { id: 'log-104', timestamp: '2026-08-02 19:30', user: 'Alex Mercer (Admin)', action: 'ROLE_UPDATE', category: 'admin', ipAddress: '192.168.1.104', device: 'Chrome macOS', status: 'success' },
  ]);

  // Client-Side Global Search Filter matching: User ID, Customer Name, Email, Phone, Booking ID/PNR
  const searchResults = useMemo(() => {
    const q = globalSearchQuery.trim().toLowerCase();
    if (!q) return { users: [], bookings: [] };

    const matchedUsers = userList.filter((u) =>
      (u.id && u.id.toLowerCase().includes(q)) ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q))
    );

    const matchedBookings = masterBookings.filter((b) =>
      (b.id && b.id.toLowerCase().includes(q)) ||
      (b.pnr && b.pnr.toLowerCase().includes(q)) ||
      (b.passengerName && b.passengerName.toLowerCase().includes(q)) ||
      (b.passengerEmail && b.passengerEmail.toLowerCase().includes(q)) ||
      (b.userId && b.userId.toLowerCase().includes(q)) ||
      (b.title && b.title.toLowerCase().includes(q))
    );

    return { users: matchedUsers, bookings: matchedBookings };
  }, [globalSearchQuery, userList, masterBookings]);

  // Client-Side filtered user list for the Directory Table
  const displayedUserList = useMemo(() => {
    const q = globalSearchQuery.trim().toLowerCase();
    if (!q) return userList;
    return userList.filter(
      (u) =>
        (u.id && u.id.toLowerCase().includes(q)) ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.toLowerCase().includes(q))
    );
  }, [globalSearchQuery, userList]);

  // Master Bookings filtering & sorting
  const filteredBookings = useMemo(() => {
    return masterBookings.filter((b) => {
      const q = bookingSearchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        b.pnr.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.passengerName.toLowerCase().includes(q) ||
        b.passengerEmail.toLowerCase().includes(q) ||
        b.userId.toLowerCase().includes(q) ||
        b.title.toLowerCase().includes(q);

      const matchesType = typeFilter === 'All' || b.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchesPayment = paymentFilter === 'All' || (b.paymentStatus && b.paymentStatus.toLowerCase() === paymentFilter.toLowerCase());

      return matchesQuery && matchesType && matchesStatus && matchesPayment;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
      if (sortBy === 'date-asc') return new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
  }, [masterBookings, bookingSearchQuery, typeFilter, statusFilter, paymentFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage]);

  const handleUpdateUserInList = async (updatedUser: ComprehensiveUser) => {
    setUserList((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setSelectedUserForProfile(updatedUser);

    try {
      const token = localStorage.getItem('voyagego_admin_token');
      await fetch(`/api/admin/users/${updatedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatedUser),
      });
    } catch (e) {
      console.error('Failed to update user on production DB:', e);
    }
  };

  const handleSelectUserForProfile = async (u: ComprehensiveUser) => {
    setSelectedUserForProfile(u);
    try {
      const token = localStorage.getItem('voyagego_admin_token');
      const res = await fetch(`/api/admin/users/${u.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setSelectedUserForProfile(data.user);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch detailed user record from API:', e);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Booking ID', 'PNR', 'User ID', 'Passenger Name', 'Email', 'Type', 'Title', 'Travel Date', 'Amount', 'Payment Status', 'Booking Status'];
    const rows = filteredBookings.map((b) => [
      b.id,
      b.pnr,
      b.userId,
      `"${b.passengerName}"`,
      b.passengerEmail,
      b.type,
      `"${b.title}"`,
      b.travelDate,
      b.amount,
      b.paymentStatus || 'Paid',
      b.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VoyageGo_Master_Bookings_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Master Bookings to CSV Excel format successfully!');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  // If user is NOT an admin, lock the portal and force Admin Login
  if (!adminUser) {
    return (
      <div id="admin-portal-module" className="bg-slate-950 min-h-screen">
        <AdminHeaderDomainBar
          currentDomain={currentDomain}
          onSwitchDomain={(d) => onSwitchDomain && onSwitchDomain(d)}
          isAdminAuthenticated={false}
        />
        <AdminLoginModal
          onLoginSuccess={(authedAdmin) => {
            setAdminUser(authedAdmin);
            showToast(`Welcome back, ${authedAdmin.name}! Admin Portal session active.`);
          }}
          onSwitchToCustomer={() => onSwitchDomain && onSwitchDomain('voyagego.com')}
        />
      </div>
    );
  }

  return (
    <div id="admin-portal-module" className="bg-slate-950 min-h-screen text-slate-100 font-sans pb-16">
      {/* Top Network Domain Header */}
      <AdminHeaderDomainBar
        currentDomain={currentDomain}
        onSwitchDomain={(d) => onSwitchDomain && onSwitchDomain(d)}
        isAdminAuthenticated={true}
        adminName={adminUser.name}
        onLogoutAdmin={() => {
          setAdminUser(null);
          localStorage.removeItem('voyagego_admin_token');
          showToast('Admin signed out successfully.');
        }}
      />

      {/* Floating Toast Notice */}
      {toastMessage && (
        <div className="fixed top-14 right-6 bg-orange-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl border border-orange-400 z-70 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Main Enterprise Control Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                VoyageGo Admin Control Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Enterprise Management Portal</h1>
            <p className="text-xs text-slate-400">
              Live database monitoring, user search directory, booking refunds, and RBAC operations.
            </p>
          </div>

          {/* Global Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Global Search: User ID, Name, Email, Phone, PNR..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-orange-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-medium focus:outline-none transition-all shadow-inner"
              />
              {globalSearchQuery && (
                <button
                  onClick={() => setGlobalSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Global Search Dropdown Results */}
            {globalSearchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl z-50 space-y-3 max-h-96 overflow-y-auto">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex justify-between">
                    <span>Matching Users ({searchResults.users.length})</span>
                  </div>
                  {searchResults.users.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic p-1">No users found</p>
                  ) : (
                    <div className="space-y-1">
                      {searchResults.users.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => {
                            handleSelectUserForProfile(u);
                            setGlobalSearchQuery('');
                          }}
                          className="p-2 hover:bg-slate-800 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                            <div>
                              <div className="font-bold text-white">{u.name}</div>
                              <div className="text-[10px] font-mono text-slate-400">{u.id} • {u.email}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded-md">
                            {u.tier}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-800 pt-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Matching Bookings ({searchResults.bookings.length})
                  </div>
                  {searchResults.bookings.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic p-1">No bookings found</p>
                  ) : (
                    <div className="space-y-1">
                      {searchResults.bookings.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => {
                            setSelectedBookingForInspect(b);
                            setGlobalSearchQuery('');
                          }}
                          className="p-2 hover:bg-slate-800 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <div className="font-bold text-white font-mono">{b.pnr} ({b.type})</div>
                            <div className="text-[10px] text-slate-400">{b.passengerName} • {b.title}</div>
                          </div>
                          <span className="font-bold text-emerald-400">${b.amount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-2 rounded-2xl border border-slate-800 overflow-x-auto shadow-md">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Dashboard Analytics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> User Search &amp; Profiles ({userList.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'bookings' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" /> Master Bookings Queue ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'coupons' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" /> Promo Coupons
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'support' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> Support Desk ({supportTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'audit' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Audit Logs
          </button>
        </div>

        {/* TAB 1: ENTERPRISE DASHBOARD ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 10 Enterprise KPI Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
                <p className="text-xl font-extrabold text-white">34,200</p>
                <span className="text-[10px] text-emerald-400 font-bold">+12% this month</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
                <p className="text-xl font-extrabold text-white">1,842</p>
                <span className="text-[10px] text-emerald-400 font-bold">+18.4% growth</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
                <p className="text-xl font-extrabold text-emerald-400">$248,950</p>
                <span className="text-[10px] text-emerald-400 font-bold">Gross Platform Volume</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Revenue</span>
                <p className="text-xl font-extrabold text-amber-400">$12,450</p>
                <span className="text-[10px] text-slate-400 font-mono">Live Daily Track</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Flights</span>
                <p className="text-xl font-extrabold text-white">142</p>
                <span className="text-[10px] text-slate-400">Routes In-Operation</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Hotels</span>
                <p className="text-xl font-extrabold text-white">88</p>
                <span className="text-[10px] text-slate-400">Partner Chains</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Packages</span>
                <p className="text-xl font-extrabold text-white">45</p>
                <span className="text-[10px] text-slate-400">Guided Expeditions</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Refunds</span>
                <p className="text-xl font-extrabold text-rose-400">3</p>
                <span className="text-[10px] text-rose-400 font-bold">Requires Admin Review</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Support Tickets</span>
                <p className="text-xl font-extrabold text-white">12</p>
                <span className="text-[10px] text-amber-400 font-bold">Open Tickets</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Partners</span>
                <p className="text-xl font-extrabold text-white">64</p>
                <span className="text-[10px] text-indigo-400 font-bold">Verified Merchants</span>
              </div>
            </div>

            {/* Interactive Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Daily Revenue Trend (SVG interactive visualizer) */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-white text-sm">Daily Revenue Performance ($)</h3>
                  <span className="text-xs text-slate-400 font-mono">Last 7 Days</span>
                </div>
                <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800">
                  {[
                    { day: 'Mon', rev: 8400 },
                    { day: 'Tue', rev: 10200 },
                    { day: 'Wed', rev: 9500 },
                    { day: 'Thu', rev: 14100 },
                    { day: 'Fri', rev: 18900 },
                    { day: 'Sat', rev: 22400 },
                    { day: 'Sun', rev: 12450 },
                  ].map((item) => {
                    const heightPct = Math.round((item.rev / 24000) * 100);
                    return (
                      <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          ${item.rev}
                        </span>
                        <div className="w-full bg-slate-800 rounded-t-lg overflow-hidden flex items-end h-32">
                          <div
                            className="w-full bg-gradient-to-t from-orange-600 to-amber-400 rounded-t-lg transition-all duration-500 group-hover:from-orange-500 group-hover:to-amber-300"
                            style={{ height: `${heightPct}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-400">{item.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart 2: Popular Destinations & Category Breakdown */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <h3 className="font-extrabold text-white text-sm">Popular Destinations Booking Share</h3>
                <div className="space-y-3">
                  {[
                    { dest: 'Bali, Indonesia', pct: 34, count: 620, color: 'bg-emerald-500' },
                    { dest: 'Dubai, UAE', pct: 26, count: 480, color: 'bg-amber-500' },
                    { dest: 'Paris, France', pct: 18, count: 330, color: 'bg-orange-500' },
                    { dest: 'Singapore', pct: 14, count: 260, color: 'bg-indigo-500' },
                    { dest: 'Cappadocia, Turkey', pct: 8, count: 152, color: 'bg-rose-500' },
                  ].map((d) => (
                    <div key={d.dest} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-200">{d.dest}</span>
                        <span className="text-slate-400 font-mono">{d.count} Bookings ({d.pct}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GLOBAL USER SEARCH & DIRECTORY */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="font-extrabold text-white text-lg">Global User Directory &amp; RBAC Inspector</h3>
                  <p className="text-xs text-slate-400">Search by User ID (e.g., VGUSR10245), Customer Name, Email, or Phone Number.</p>
                </div>
              </div>

              {/* User Directory Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800">
                        <th className="p-3.5">User Details</th>
                        <th className="p-3.5">ID / Email</th>
                        <th className="p-3.5">Role &amp; Tier</th>
                        <th className="p-3.5">Phone</th>
                        <th className="p-3.5">Wallet / Coins</th>
                        <th className="p-3.5">Reg. Date &amp; Last Login</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {displayedUserList.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-12 text-center text-slate-400 font-medium text-xs">
                            No registered users found.
                          </td>
                        </tr>
                      ) : (
                        displayedUserList.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-3.5">
                              <div className="flex items-center gap-3">
                                <img src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'} alt={u.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700" />
                                <div>
                                  <div className="font-extrabold text-white">{u.name}</div>
                                  <div className="text-[10px] text-slate-400">{u.country || 'N/A'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono">
                              <div className="font-bold text-orange-400">{u.id}</div>
                              <div className="text-[11px] text-slate-400">{u.email}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700 uppercase">
                                  {u.role || 'customer'}
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                                  {u.tier || 'Silver'}
                                </span>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono text-slate-300">{u.phone || 'N/A'}</td>
                            <td className="p-3.5 font-mono">
                              <div className="font-bold text-emerald-400">${(u.walletBalance || 0).toFixed(2)}</div>
                              <div className="text-[10px] text-amber-400">{u.voyageCoins || 0} Coins</div>
                            </td>
                            <td className="p-3.5 font-mono text-[11px]">
                              <div className="text-slate-300"><span className="text-slate-500 text-[10px]">Reg:</span> {u.registrationDate || 'N/A'}</div>
                              <div className="text-slate-400"><span className="text-slate-500 text-[10px]">Login:</span> {u.lastLogin || 'Never'}</div>
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  (u.accountStatus || 'Active') === 'Active'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {u.accountStatus || 'Active'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleSelectUserForProfile(u)}
                                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1 ml-auto"
                              >
                                Inspect User <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MASTER BOOKINGS QUEUE */}
        {activeTab === 'bookings' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="font-extrabold text-white text-lg">Master Booking Queue</h3>
                  <p className="text-xs text-slate-400">View, search, filter, export, and manage every booking across the entire system.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Export to Excel (.CSV)
                  </button>
                  <button
                    onClick={handlePrintPDF}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5 text-orange-400" /> Export to PDF
                  </button>
                </div>
              </div>

              {/* Filters & Sorting Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                <input
                  type="text"
                  value={bookingSearchQuery}
                  onChange={(e) => setBookingSearchQuery(e.target.value)}
                  placeholder="Filter queue by PNR, User ID..."
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono"
                />

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-300"
                >
                  <option value="All">All Booking Types</option>
                  <option value="Flight">Flights</option>
                  <option value="Hotel">Hotels</option>
                  <option value="Train">Trains</option>
                  <option value="Bus">Buses</option>
                  <option value="Cab">Cabs</option>
                  <option value="Experience">Experiences</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-300"
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
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-300"
                >
                  <option value="All">All Payments</option>
                  <option value="Paid">Paid</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Pending">Pending</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-300"
                >
                  <option value="date-desc">Sort: Date (Newest First)</option>
                  <option value="date-asc">Sort: Date (Oldest First)</option>
                  <option value="amount-desc">Sort: Amount (Highest)</option>
                  <option value="amount-asc">Sort: Amount (Lowest)</option>
                </select>
              </div>

              {/* Master Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800">
                        <th className="p-3.5">PNR / ID</th>
                        <th className="p-3.5">Customer &amp; User ID</th>
                        <th className="p-3.5">Service Details</th>
                        <th className="p-3.5">Travel Date</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Payment</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {paginatedBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5 font-mono">
                            <div className="font-extrabold text-orange-400">{b.pnr}</div>
                            <div className="text-[10px] text-slate-500">{b.id}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-white">{b.passengerName}</div>
                            <div className="text-[10px] font-mono text-slate-400">{b.userId}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md mr-1.5">
                              {b.type}
                            </span>
                            <span className="font-medium text-slate-200">{b.title}</span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-300">{b.travelDate}</td>
                          <td className="p-3.5 font-mono font-bold text-emerald-400">${b.amount.toFixed(2)}</td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                b.paymentStatus === 'Paid'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {b.paymentStatus || 'Paid'}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                b.status === 'Confirmed'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : b.status === 'Completed'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setSelectedBookingForInspect(b)}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all border border-slate-700 ml-auto"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
                <span>Showing {paginatedBookings.length} of {filteredBookings.length} bookings</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-xl disabled:opacity-40 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono font-bold text-white">Page {currentPage} of {totalPages}</span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-xl disabled:opacity-40 hover:text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROMO COUPONS */}
        {activeTab === 'coupons' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl text-xs animate-fadeIn">
            <h3 className="font-extrabold text-white text-base">Commercial Coupons &amp; Discount Codes</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!couponCode) return;
                onAddCoupon({
                  code: couponCode.toUpperCase(),
                  discountType: 'percentage',
                  discountValue: discountVal,
                  minAmount: 100,
                  description: couponDesc || `${discountVal}% off on all bookings`,
                  validTill: '2026-12-31',
                });
                setCouponCode('');
                setCouponDesc('');
                showToast(`Coupon ${couponCode.toUpperCase()} issued successfully.`);
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800"
            >
              <input
                type="text"
                required
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon Code (e.g. SUMMER50)"
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase"
              />
              <input
                type="number"
                required
                value={discountVal}
                onChange={(e) => setDiscountVal(Number(e.target.value))}
                placeholder="Discount %"
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
              <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl py-2">
                Generate Promo Coupon
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {coupons.map((c) => (
                <div key={c.code} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="font-mono font-black text-amber-400 text-sm block">{c.code}</span>
                  <p className="text-slate-300 font-bold">{c.discountValue}% Off • Min ${c.minAmount}</p>
                  <p className="text-[10px] text-slate-500">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SUPPORT DESK */}
        {activeTab === 'support' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl text-xs animate-fadeIn">
            <h3 className="font-extrabold text-white text-base">Customer Support Desk Queue</h3>
            <div className="border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                    <th className="p-3">Ticket ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {supportTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-orange-400">{t.id}</td>
                      <td className="p-3 font-bold text-white">{t.customerName}</td>
                      <td className="p-3 text-slate-200">{t.subject}</td>
                      <td className="p-3 text-slate-400">{t.category}</td>
                      <td className="p-3 font-bold text-rose-400">{t.priority}</td>
                      <td className="p-3 font-bold text-emerald-400">{t.status}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSupportTickets(supportTickets.map((x) => (x.id === t.id ? { ...x, status: 'Resolved' } : x)));
                            showToast(`Support Ticket ${t.id} marked resolved.`);
                          }}
                          className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg"
                        >
                          Resolve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl text-xs animate-fadeIn">
            <h3 className="font-extrabold text-white text-base">System Security &amp; Audit Trail Logs</h3>
            <div className="border border-slate-800 rounded-2xl overflow-hidden font-mono">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Device</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {auditLogs.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/40">
                      <td className="p-3 text-slate-400">{l.timestamp}</td>
                      <td className="p-3 font-bold text-white">{l.user}</td>
                      <td className="p-3 text-orange-400 font-bold">{l.action}</td>
                      <td className="p-3 text-slate-300">{l.ipAddress}</td>
                      <td className="p-3 text-slate-400">{l.device}</td>
                      <td className="p-3 font-bold text-emerald-400">{l.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* User Profile Drawer Modal */}
      {selectedUserForProfile && (
        <AdminUserProfileModal
          user={selectedUserForProfile}
          userBookings={masterBookings.filter((b) => b.userId === selectedUserForProfile.id || (b.passengerEmail && b.passengerEmail.toLowerCase() === selectedUserForProfile.email.toLowerCase()))}
          onClose={() => setSelectedUserForProfile(null)}
          onUpdateUser={handleUpdateUserInList}
          onSelectBooking={(b) => setSelectedBookingForInspect(b)}
          onShowToast={showToast}
        />
      )}

      {/* Booking Details Modal */}
      {selectedBookingForInspect && (
        <AdminBookingDetailModal
          booking={selectedBookingForInspect}
          onClose={() => setSelectedBookingForInspect(null)}
          onUpdateStatus={(pnr, status) => {
            onUpdateBookingStatus(pnr, status);
            setSelectedBookingForInspect(null);
            showToast(`Booking ${pnr} status changed to ${status}.`);
          }}
          onUpdateBooking={onUpdateBooking}
          onShowToast={showToast}
        />
      )}
    </div>
  );
};
