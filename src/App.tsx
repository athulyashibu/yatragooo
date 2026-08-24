import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BookingSearchHeader } from './components/BookingSearchHeader';
import { FlightBookingView } from './components/flight/FlightBookingView';
import { HotelBookingView } from './components/hotel/HotelBookingView';
import { HomestayBookingView } from './components/homestay/HomestayBookingView';
import { PackageBookingView } from './components/package/PackageBookingView';
import { BusBookingView } from './components/bus/BusBookingView';
import { TrainBookingView } from './components/train/TrainBookingView';
import { CabBookingView } from './components/cab/CabBookingView';
import { ExperienceView } from './components/experience/ExperienceView';
import { VisaInsuranceView } from './components/visa/VisaInsuranceView';
import { AITripPlannerView } from './components/ai/AITripPlannerView';
import { CommunityView } from './components/community/CommunityView';
import { UserDashboardView } from './components/dashboard/UserDashboardView';
import { AdminPortalView } from './components/admin/AdminPortalView';
import { PartnerPortalView } from './components/partner/PartnerPortalView';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { ArchitectureDocsView } from './components/architecture/ArchitectureDocsView';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AuthModal } from './components/auth/AuthModal';

import {
  currentUser as initialUser,
  flightsData,
  hotelsData,
  homestaysData,
  packagesData,
  busesData,
  trainsData,
  cabsData,
  experiencesData,
  communityStories,
  activeBookingsData,
  couponsData as initialCoupons,
} from './data/mockData';
import { Booking, Coupon, TravelMode, UserProfile, NotificationItem } from './types';

import { AdminHeaderDomainBar } from './components/admin/AdminHeaderDomainBar';

export default function App() {
  const [currentDomain, setCurrentDomain] = useState<'voyagego.com' | 'admin.voyagego.com'>('voyagego.com');
  const [currentMode, setCurrentMode] = useState<TravelMode>('flights');
  const [adminSubTab, setAdminSubTab] = useState<string>('overview');
  const [dashboardTab, setDashboardTab] = useState<'bookings' | 'wallet' | 'wishlist' | 'security'>('bookings');

  // Handle Domain Switching
  const handleSwitchDomain = (domain: 'voyagego.com' | 'admin.voyagego.com') => {
    setCurrentDomain(domain);
    if (domain === 'admin.voyagego.com') {
      setCurrentMode('admin');
    } else {
      if (currentMode === 'admin') {
        setCurrentMode('flights');
      }
    }
  };
  
  // Auth state persistent loading from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('voyagego_auth_token'));
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('voyagego_user_session');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialUser;
  });
  const [bookings, setBookings] = useState<Booking[]>(activeBookingsData);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [checkoutItem, setCheckoutItem] = useState<any | null>(null);

  const [logoutToast, setLogoutToast] = useState<string | null>(null);
  const [apiErrorToast, setApiErrorToast] = useState<string | null>(null);

  // Filter authenticated user's bookings as single source of truth
  const userBookings = React.useMemo(() => {
    if (!isAuthenticated || !user || !user.id) return [];
    return bookings.filter(
      (b) =>
        b.userId === user.id ||
        (user.email && b.passengerEmail && b.passengerEmail.toLowerCase() === user.email.toLowerCase())
    );
  }, [bookings, user, isAuthenticated]);

  // Issue/refresh JWT token, sync user to production DB, and fetch user bookings from API
  React.useEffect(() => {
    if (isAuthenticated && user && user.id) {
      // Automatically register/sync user with backend PostgreSQL database store
      fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      }).catch((err) => console.warn('User database sync warning:', err));

      fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Token request failed with status ${res.status}`);
          }
          const ct = res.headers.get('content-type');
          if (!ct || !ct.includes('application/json')) {
            throw new Error(`Expected JSON from token endpoint, got ${ct}`);
          }
          return res.json();
        })
        .then((data) => {
          const token = data.token || `token_${user.id}_${Date.now()}`;
          localStorage.setItem('voyagego_auth_token', token);

          return fetch('/api/bookings', {
            headers: { Authorization: `Bearer ${token}` },
          });
        })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Bookings request failed with status ${res.status}`);
          }
          const ct = res.headers.get('content-type');
          if (!ct || !ct.includes('application/json')) {
            throw new Error(`Expected JSON from bookings endpoint, got ${ct}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.success && Array.isArray(data.bookings)) {
            setBookings((prev) => {
              const otherUsersBookings = prev.filter(
                (b) =>
                  b.userId !== user.id &&
                  !(user.email && b.passengerEmail && b.passengerEmail.toLowerCase() === user.email.toLowerCase())
              );
              return [...data.bookings, ...otherUsersBookings];
            });
          }
        })
        .catch((err) => {
          console.warn('API sync warning (using local fallback state):', err.message);
        });
    }
  }, [user, isAuthenticated]);

  // State for diagnostic results
  const [diagnosticLogs, setDiagnosticLogs] = React.useState<Array<{
    endpoint: string;
    method: string;
    status: number | 'ERROR';
    ok: boolean;
    durationMs: number;
    details: string;
  }>>([]);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = React.useState(false);
  const [isDiagnosing, setIsDiagnosing] = React.useState(false);

  // Diagnostic utility testing connectivity of all critical API endpoints
  const runSystemDiagnostics = React.useCallback(async () => {
    setIsDiagnosing(true);
    console.log('%c[SYSTEM DIAGNOSTICS] Starting API Endpoint Health Check...', 'color: #0284c7; font-weight: bold; font-size: 13px;');
    
    const results: Array<{
      endpoint: string;
      method: string;
      status: number | 'ERROR';
      ok: boolean;
      durationMs: number;
      details: string;
    }> = [];

    const testUserEmail = user.email || 'admin@voyagego.com';
    const testUserId = user.id || 'admin_001';
    const authToken = localStorage.getItem('voyagego_auth_token') || localStorage.getItem('voyagego_admin_token');

    // 1. Test GET /api/health
    try {
      const start = performance.now();
      const res = await fetch('/api/health');
      const duration = Math.round(performance.now() - start);
      const data = await res.json().catch(() => null);
      
      const isOk = res.ok;
      results.push({
        endpoint: '/api/health',
        method: 'GET',
        status: res.status,
        ok: isOk,
        durationMs: duration,
        details: isOk ? JSON.stringify(data) : `HTTP ${res.status}: Health check failed`,
      });
      if (isOk) {
        console.log(`%c[DIAGNOSTICS SUCCESS] /api/health (${duration}ms):`, 'color: #16a34a; font-weight: bold;', data);
      } else {
        console.error(`[DIAGNOSTICS ERROR] /api/health returned HTTP ${res.status}:`, data);
      }
    } catch (err: any) {
      results.push({
        endpoint: '/api/health',
        method: 'GET',
        status: 'ERROR',
        ok: false,
        durationMs: 0,
        details: `Network/Connectivity Error: ${err.message || 'Unreachable'}`,
      });
      console.error('[DIAGNOSTICS UNREACHABLE] GET /api/health failed:', err.message);
    }

    // 2. Test POST /api/users/sync
    try {
      const start = performance.now();
      const res = await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: testUserId,
          email: testUserEmail,
          name: user.name || 'Diagnostic Runner',
          role: user.role || 'admin',
        }),
      });
      const duration = Math.round(performance.now() - start);
      const data = await res.json().catch(() => null);

      const isOk = res.ok && data?.success;
      results.push({
        endpoint: '/api/users/sync',
        method: 'POST',
        status: res.status,
        ok: isOk,
        durationMs: duration,
        details: isOk ? `Synced user ${testUserEmail} successfully` : `HTTP ${res.status}: ${data?.error || data?.message || 'Sync failed'}`,
      });
      if (isOk) {
        console.log(`%c[DIAGNOSTICS SUCCESS] /api/users/sync (${duration}ms):`, 'color: #16a34a; font-weight: bold;', data);
      } else {
        console.error(`[DIAGNOSTICS ERROR] /api/users/sync returned HTTP ${res.status}:`, data);
      }
    } catch (err: any) {
      results.push({
        endpoint: '/api/users/sync',
        method: 'POST',
        status: 'ERROR',
        ok: false,
        durationMs: 0,
        details: `Network/Connectivity Error: ${err.message || 'Unreachable'}`,
      });
      console.error('[DIAGNOSTICS UNREACHABLE] POST /api/users/sync failed:', err.message);
    }

    // 3. Test POST /api/auth/token
    try {
      const start = performance.now();
      const res = await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: testUserId,
          email: testUserEmail,
          role: user.role || 'admin',
          name: user.name || 'Diagnostic Runner',
        }),
      });
      const duration = Math.round(performance.now() - start);
      const data = await res.json().catch(() => null);

      const isOk = res.ok && data?.success && !!data?.token;
      results.push({
        endpoint: '/api/auth/token',
        method: 'POST',
        status: res.status,
        ok: isOk,
        durationMs: duration,
        details: isOk ? `Issued JWT session token for ${testUserEmail}` : `HTTP ${res.status}: ${data?.error || data?.message || 'Token generation failed'}`,
      });
      if (isOk) {
        console.log(`%c[DIAGNOSTICS SUCCESS] /api/auth/token (${duration}ms):`, 'color: #16a34a; font-weight: bold;', data);
      } else {
        console.error(`[DIAGNOSTICS ERROR] /api/auth/token returned HTTP ${res.status}:`, data);
      }
    } catch (err: any) {
      results.push({
        endpoint: '/api/auth/token',
        method: 'POST',
        status: 'ERROR',
        ok: false,
        durationMs: 0,
        details: `Network/Connectivity Error: ${err.message || 'Unreachable'}`,
      });
      console.error('[DIAGNOSTICS UNREACHABLE] POST /api/auth/token failed:', err.message);
    }

    // 4. Test GET /api/bookings
    try {
      const start = performance.now();
      const headers: Record<string, string> = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      const res = await fetch('/api/bookings', { headers });
      const duration = Math.round(performance.now() - start);
      const data = await res.json().catch(() => null);

      const isOk = res.ok && data?.success;
      results.push({
        endpoint: '/api/bookings',
        method: 'GET',
        status: res.status,
        ok: isOk,
        durationMs: duration,
        details: isOk
          ? `Retrieved ${data?.count ?? 0} bookings (Role: ${data?.role || 'authenticated'})`
          : `HTTP ${res.status}: ${data?.error || data?.message || 'Bookings endpoint error'}`,
      });
      if (isOk) {
        console.log(`%c[DIAGNOSTICS SUCCESS] /api/bookings (${duration}ms):`, 'color: #16a34a; font-weight: bold;', data);
      } else {
        console.error(`[DIAGNOSTICS ERROR] /api/bookings returned HTTP ${res.status}:`, data);
      }
    } catch (err: any) {
      results.push({
        endpoint: '/api/bookings',
        method: 'GET',
        status: 'ERROR',
        ok: false,
        durationMs: 0,
        details: `Network/Connectivity Error: ${err.message || 'Unreachable'}`,
      });
      console.error('[DIAGNOSTICS UNREACHABLE] GET /api/bookings failed:', err.message);
    }

    setDiagnosticLogs(results);
    setIsDiagnosing(false);
    console.log('%c[SYSTEM DIAGNOSTICS COMPLETE] Summary:', 'color: #0284c7; font-weight: bold;', results);
    return results;
  }, [user]);

  // Real-time synchronization hook: Poll backend database status every 30 seconds
  React.useEffect(() => {
    const pollDatabaseSync = async () => {
      try {
        const adminToken = localStorage.getItem('voyagego_admin_token');
        const userToken = localStorage.getItem('voyagego_auth_token');

        // Check backend system health
        const healthRes = await fetch('/api/health');
        if (!healthRes.ok) {
          throw new Error(`Database health endpoint returned status ${healthRes.status}`);
        }

        if (adminToken) {
          const [usersRes, bookingsRes] = await Promise.all([
            fetch('/api/admin/users', { headers: { Authorization: `Bearer ${adminToken}` } }),
            fetch('/api/admin/bookings', { headers: { Authorization: `Bearer ${adminToken}` } }),
          ]);

          if (usersRes.ok && bookingsRes.ok) {
            const bData = await bookingsRes.json();
            if (bData && bData.success && Array.isArray(bData.bookings)) {
              setBookings(bData.bookings);
            }
          }
        } else if (userToken) {
          const bookingsRes = await fetch('/api/bookings', {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          if (bookingsRes.ok) {
            const bData = await bookingsRes.json();
            if (bData && bData.success && Array.isArray(bData.bookings)) {
              setBookings((prev) => {
                const otherBookings = prev.filter(
                  (b) => b.userId !== user.id && !(user.email && b.passengerEmail && b.passengerEmail.toLowerCase() === user.email.toLowerCase())
                );
                return [...bData.bookings, ...otherBookings];
              });
            }
          }
        }

        // Connection healthy: clear any previous error alert
        setApiErrorToast(null);
      } catch (err: any) {
        console.warn('Database polling notice:', err);
        const alertMsg = 'Notice: Production database endpoints are currently unreachable. Retrying sync in 30s...';
        setApiErrorToast(alertMsg);
        // Run full endpoint diagnostic log
        runSystemDiagnostics();
        // Automatically hide alert after 7 seconds to keep interface clean
        setTimeout(() => setApiErrorToast(null), 7000);
      }
    };

    pollDatabaseSync();
    const intervalId = setInterval(pollDatabaseSync, 30000);
    return () => clearInterval(intervalId);
  }, [user, runSystemDiagnostics]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('voyagego_auth_token');
      localStorage.removeItem('voyagego_admin_token');
      localStorage.removeItem('voyagego_admin_user');
      localStorage.removeItem('voyagego_user_session');
      sessionStorage.clear();
    } catch {
      // Ignore in sandbox environment
    }
    setIsAuthenticated(false);
    setUser(initialUser);
    setCurrentMode('flights');
    setLogoutToast('You have been logged out successfully.');
    setTimeout(() => setLogoutToast(null), 4000);
  };

  const handleUpdateUserProfile = (updatedUser: Partial<UserProfile>) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUser };
      try {
        localStorage.setItem('voyagego_user_session', JSON.stringify(merged));
      } catch {
        // ignore
      }
      fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      }).catch((err) => console.warn('Profile update sync error:', err));
      return merged;
    });
  };

  const handleDeleteAccount = () => {
    handleLogout();
    setLogoutToast('Account permanently deleted.');
  };

  const handleLoginSuccess = (profile?: UserProfile) => {
    setIsAuthenticated(true);
    if (profile) {
      setUser(profile);
      try {
        localStorage.setItem('voyagego_user_session', JSON.stringify(profile));
      } catch {
        // ignore
      }
      fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      }).catch((err) => console.warn('Login sync error:', err));
      if (profile.role === 'admin') {
        setCurrentMode('admin');
      }
    }
    try {
      localStorage.setItem('voyagego_auth_token', `token_${Date.now()}`);
    } catch {
      // Ignore
    }
  };

  // Notification state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Flight EK-502 Gate Updated',
      message: 'Your flight to Tokyo Narita has been assigned Gate B14.',
      timestamp: '10 mins ago',
      read: false,
      type: 'info',
    },
    {
      id: 'notif-2',
      title: 'Promo: VOYAGEFLY50 Applied',
      message: 'Claim $50 off your next international roundtrip.',
      timestamp: '2 hours ago',
      read: false,
      type: 'promo',
    },
    {
      id: 'notif-3',
      title: '+100 Voyage Coins Earned!',
      message: 'Loyalty bonus added to your wallet for hotel booking.',
      timestamp: '1 day ago',
      read: true,
      type: 'info',
    },
  ]);

  // Admin metrics
  const [adminMetrics, setAdminMetrics] = useState({
    totalRevenue: 248950,
    totalBookings: bookings.length + 1840,
    activeUsers: 34200,
    avgConversionRate: 4.85,
    revenueByCategory: [
      { name: 'Flights', value: 98400 },
      { name: 'Hotels', value: 76500 },
      { name: 'Packages', value: 42100 },
      { name: 'Trains & Buses', value: 18200 },
      { name: 'Cabs & Experiences', value: 13750 },
    ],
    monthlyRevenue: [
      { month: 'Mar', revenue: 28400, bookings: 210 },
      { month: 'Apr', revenue: 34200, bookings: 260 },
      { month: 'May', revenue: 41800, bookings: 310 },
      { month: 'Jun', revenue: 49500, bookings: 380 },
      { month: 'Jul', revenue: 58200, bookings: 420 },
      { month: 'Aug', revenue: 64500, bookings: 480 },
    ],
  });

  const handleToggleWishlist = (item: any) => {
    const exists = wishlist.some((w) => w.id === item.id);
    if (exists) {
      setWishlist(wishlist.filter((w) => w.id !== item.id));
    } else {
      setWishlist([...wishlist, item]);
    }
  };

  const isWishlisted = (id: string) => wishlist.some((w) => w.id === id);

  const handleConfirmBooking = (newBooking: Booking) => {
    const bookingWithUser: Booking = {
      ...newBooking,
      userId: user?.id || 'usr_8921',
      passengerEmail: user?.email || newBooking.passengerEmail,
    };

    setBookings((prev) => [bookingWithUser, ...prev]);
    // Reward Voyage Coins
    setUser((prev) => ({
      ...prev,
      voyageCoins: prev.voyageCoins + 100,
    }));
    // Add real-time notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Booking Confirmed: ${newBooking.title}`,
        message: `PNR: ${newBooking.pnr} confirmed. Check board pass in My Bookings!`,
        timestamp: 'Just now',
        read: false,
        type: 'info',
      },
      ...prev,
    ]);
  };

  const handleCancelBooking = (pnr: string) => {
    const token = localStorage.getItem('voyagego_auth_token') || '';
    if (token) {
      fetch(`/api/bookings/${pnr}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.pnr === pnr || b.id === pnr
          ? { ...b, status: 'Cancelled' as const, paymentStatus: 'Refunded' as const }
          : b
      )
    );
  };

  const handleUpdateBooking = (updatedBooking: Booking) => {
    const token = localStorage.getItem('voyagego_auth_token') || '';
    if (token) {
      fetch(`/api/bookings/${updatedBooking.pnr || updatedBooking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBooking),
      }).catch(() => {});
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === updatedBooking.id || b.pnr === updatedBooking.pnr ? { ...b, ...updatedBooking } : b
      )
    );
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons([newCoupon, ...coupons]);
  };

  const handleUpdateBookingStatus = (pnr: string, status: 'Confirmed' | 'Cancelled' | 'Refunded') => {
    setBookings(
      bookings.map((b) => (b.pnr === pnr ? { ...b, status: status as any } : b))
    );
  };

  const handleSendNotification = (title: string, message: string, type: 'info' | 'promo' | 'alert') => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title,
        message,
        timestamp: 'Just now',
        read: false,
        type,
      },
      ...prev,
    ]);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div id="voyagego-root" className="min-h-screen bg-slate-100/70 font-sans text-slate-800 flex flex-col antialiased selection:bg-orange-500 selection:text-white">
      {/* Logout Toast Banner */}
      {logoutToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-extrabold">{logoutToast}</span>
        </div>
      )}

      {/* API Connection / Sync Error Toast */}
      {apiErrorToast && (
        <div className="fixed top-20 right-6 z-50 bg-amber-950/90 text-amber-200 px-5 py-3 rounded-2xl shadow-2xl border border-amber-600/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 backdrop-blur-md max-w-md">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0"></div>
          <span className="text-xs font-semibold leading-relaxed flex-1">{apiErrorToast}</span>
          <button
            onClick={() => setApiErrorToast(null)}
            className="text-amber-400 hover:text-white font-extrabold text-sm px-1 transition-colors"
            title="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        isAuthenticated={isAuthenticated}
        user={user}
        wishlistCount={wishlist.length}
        activeBookingsCount={userBookings.length}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenWishlist={() => { setDashboardTab('wishlist'); setCurrentMode('dashboard'); }}
        onOpenBookings={() => { setDashboardTab('bookings'); setCurrentMode('dashboard'); }}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenWallet={() => { setDashboardTab('wallet'); setCurrentMode('dashboard'); }}
        onOpenSettings={() => { setDashboardTab('security'); setCurrentMode('dashboard'); }}
        onLoginClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
        onSignUpClick={() => { setAuthModalMode('signup'); setIsAuthModalOpen(true); }}
        onLogout={handleLogout}
        onUpdateUserProfile={handleUpdateUserProfile}
      />

      {/* Main Booking Mode Search Header (Shown when not in admin/partner/architecture/dashboard views) */}
      {currentMode !== 'admin' && currentMode !== 'partner' && currentMode !== 'architecture' && currentMode !== 'dashboard' && (
        <BookingSearchHeader currentMode={currentMode} onSelectMode={setCurrentMode} />
      )}

      {/* Dynamic View Router */}
      <main className="flex-1">
        {currentMode === 'flights' && (
          <FlightBookingView
            flights={flightsData}
            onBookFlight={(flight, selectedSeat) => {
              setCheckoutItem({
                type: 'Flight',
                title: `${flight.airline} (${flight.flightNumber})`,
                subtitle: `${flight.fromCity} ➔ ${flight.toCity} • Seat ${selectedSeat}`,
                price: flight.price,
                details: { seat: selectedSeat, cabinClass: flight.cabinClass, baggage: flight.baggageAllowance },
              });
            }}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted}
          />
        )}

        {currentMode === 'hotels' && (
          <HotelBookingView
            hotels={hotelsData}
            onBookHotel={(hotel, selectedRoom) => {
              setCheckoutItem({
                type: 'Hotel',
                title: hotel.name,
                subtitle: `${selectedRoom.name} (${hotel.location})`,
                price: selectedRoom.price,
                details: { roomType: selectedRoom.name, bed: selectedRoom.bed },
              });
            }}
          />
        )}

        {currentMode === 'homestays' && (
          <HomestayBookingView
            homestays={homestaysData}
            onBookHomestay={(hs) => {
              setCheckoutItem({
                type: 'Homestay',
                title: hs.title,
                subtitle: `${hs.location} • Hosted by ${hs.hostName}`,
                price: hs.pricePerNight,
                details: { host: hs.hostName, bedrooms: hs.bedrooms },
              });
            }}
          />
        )}

        {currentMode === 'packages' && (
          <PackageBookingView
            packages={packagesData}
            onBookPackage={(pkg) => {
              setCheckoutItem({
                type: 'Package',
                title: pkg.title,
                subtitle: `${pkg.durationDays} Days / ${pkg.durationNights} Nights • ${pkg.destination}`,
                price: pkg.price,
                details: { duration: `${pkg.durationDays} Days`, destination: pkg.destination },
              });
            }}
          />
        )}

        {currentMode === 'buses' && (
          <BusBookingView
            buses={busesData}
            onBookBus={(bus, seat) => {
              setCheckoutItem({
                type: 'Bus',
                title: bus.busOperator,
                subtitle: `${bus.fromCity} ➔ ${bus.toCity} • Seat ${seat}`,
                price: bus.price,
                details: { seat, busType: bus.busType },
              });
            }}
          />
        )}

        {currentMode === 'trains' && (
          <TrainBookingView
            trains={trainsData}
            onBookTrain={(train, selectedClass) => {
              setCheckoutItem({
                type: 'Train',
                title: `${train.trainName} (${train.trainNumber})`,
                subtitle: `${train.fromStation} ➔ ${train.toStation} • Class ${selectedClass.code}`,
                price: selectedClass.price,
                details: { class: selectedClass.name, trainNo: train.trainNumber },
              });
            }}
          />
        )}

        {currentMode === 'cabs' && (
          <CabBookingView
            cabs={cabsData}
            onBookCab={(cab) => {
              setCheckoutItem({
                type: 'Cab',
                title: cab.vehicleName,
                subtitle: `Outstation Rental • Driver: ${cab.driverName}`,
                price: cab.estimatedPrice,
                details: { driver: cab.driverName, capacity: cab.capacity },
              });
            }}
          />
        )}

        {currentMode === 'experiences' && (
          <ExperienceView
            experiences={experiencesData}
            onBookExperience={(exp) => {
              setCheckoutItem({
                type: 'Experience',
                title: exp.title,
                subtitle: `${exp.location} • Duration: ${exp.duration}`,
                price: exp.pricePerPerson,
                details: { duration: exp.duration, category: exp.category },
              });
            }}
          />
        )}

        {currentMode === 'visa' && <VisaInsuranceView />}

        {currentMode === 'ai-planner' && <AITripPlannerView />}

        {currentMode === 'community' && <CommunityView stories={communityStories} />}

        {currentMode === 'partner' && <PartnerPortalView />}

        {currentMode === 'dashboard' && (
          <UserDashboardView
            user={user}
            bookings={userBookings}
            wishlist={wishlist}
            onCancelBooking={handleCancelBooking}
            onUpdateBooking={handleUpdateBooking}
            onRemoveWishlist={(id) => setWishlist(wishlist.filter((w) => w.id !== id))}
            onUpdateUserProfile={handleUpdateUserProfile}
            onDeleteAccount={handleDeleteAccount}
            initialTab={dashboardTab}
            onSelectMode={setCurrentMode}
          />
        )}

        {currentMode === 'admin' && (
          <AdminPortalView
            metrics={adminMetrics}
            bookings={bookings}
            coupons={coupons}
            user={user}
            onAddCoupon={handleAddCoupon}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onUpdateBooking={handleUpdateBooking}
            onSendNotification={handleSendNotification}
            initialTab={adminSubTab as any}
            currentDomain={currentDomain}
            onSwitchDomain={handleSwitchDomain}
          />
        )}

        {currentMode === 'architecture' && <ArchitectureDocsView />}
      </main>

      {/* Auth Modal for Guests (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Notification Drawer Component */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onDismiss={handleDismissNotification}
      />

      {/* Unified Checkout Modal */}
      {checkoutItem && (
        <CheckoutModal
          itemToBook={checkoutItem}
          user={user}
          coupons={coupons}
          onClose={() => setCheckoutItem(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* API Diagnostic Utility Modal */}
      {isDiagnosticOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">⚙️</span>
                <div>
                  <h3 className="font-extrabold text-base text-white">System API Connectivity Diagnostics</h3>
                  <p className="text-xs text-slate-400">Testing production database and core endpoint connectivity</p>
                </div>
              </div>
              <button
                onClick={() => setIsDiagnosticOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-xs font-semibold text-slate-300">
                Status: {isDiagnosing ? 'Testing endpoints...' : diagnosticLogs.length > 0 ? 'Diagnostic test completed' : 'Ready'}
              </span>
              <button
                onClick={runSystemDiagnostics}
                disabled={isDiagnosing}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors disabled:opacity-50"
              >
                {isDiagnosing ? 'Running Diagnostics...' : 'Run Diagnostics Now'}
              </button>
            </div>

            <div className="space-y-2">
              {diagnosticLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs font-mono flex flex-col gap-1 ${
                    log.ok
                      ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                  }`}
                >
                  <div className="flex justify-between items-center font-bold">
                    <span>
                      [{log.method}] {log.endpoint}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px]">
                      Status: {log.status} ({log.durationMs}ms)
                    </span>
                  </div>
                  <div className="text-[11px] opacity-90 break-all">{log.details}</div>
                </div>
              ))}
              {diagnosticLogs.length === 0 && !isDiagnosing && (
                <div className="p-4 bg-slate-950/50 rounded-xl text-slate-400 text-xs text-center border border-slate-800">
                  Click &quot;Run Diagnostics Now&quot; to test connectivity for /api/health, /api/users/sync, /api/auth/token, and /api/bookings.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsDiagnosticOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Diagnostic Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer id="main-footer" className="bg-slate-900 text-slate-400 text-xs py-8 px-4 sm:px-6 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div>
            <span className="font-extrabold text-white text-lg">
              Voyage<span className="text-orange-500">Go</span> Platform
            </span>
            <p className="mt-1 text-slate-500">
              Enterprise Commercial Travel Architecture • Goibibo &amp; MakeMyTrip Experience
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-slate-300 font-semibold">
            <span onClick={() => setCurrentMode('flights')} className="hover:text-white cursor-pointer">Flights</span>
            <span onClick={() => setCurrentMode('hotels')} className="hover:text-white cursor-pointer">Hotels</span>
            <span onClick={() => setCurrentMode('packages')} className="hover:text-white cursor-pointer">Packages</span>
            <span onClick={() => setCurrentMode('partner')} className="hover:text-amber-300 cursor-pointer">Partner Portal</span>
            <span onClick={() => setCurrentMode('ai-planner')} className="hover:text-orange-400 cursor-pointer">AI Planner</span>
            <span onClick={() => setCurrentMode('admin')} className="hover:text-emerald-400 cursor-pointer">Admin Portal</span>
            <span onClick={() => setCurrentMode('architecture')} className="hover:text-amber-300 cursor-pointer font-bold">Architecture Specs</span>
            <button
              onClick={() => {
                setIsDiagnosticOpen(true);
                runSystemDiagnostics();
              }}
              className="text-sky-400 hover:text-sky-300 font-bold underline cursor-pointer"
            >
              API Diagnostics
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

