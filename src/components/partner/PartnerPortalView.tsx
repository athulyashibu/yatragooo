import React, { useState } from 'react';
import {
  Building2,
  Compass,
  Briefcase,
  Bus,
  Plus,
  DollarSign,
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  Calendar,
  MessageSquare,
  Edit3,
  Eye,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';
import { PartnerListing, PartnerBooking } from '../../types';

export const PartnerPortalView: React.FC = () => {
  const [partnerType, setPartnerType] = useState<'hotel' | 'tour_guide' | 'travel_agency' | 'bus_operator'>('hotel');
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings' | 'revenue' | 'reviews'>('listings');

  // Sample partner listings
  const [listings, setListings] = useState<PartnerListing[]>([
    {
      id: 'prt_1',
      partnerType: 'hotel',
      title: 'Grand Palace Luxury Resort & Spa',
      location: 'Ubud, Bali',
      price: 180,
      status: 'active',
      totalBookings: 142,
      rating: 4.9,
      revenue: 25560,
      availableUnits: 12,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600'],
    },
    {
      id: 'prt_2',
      partnerType: 'tour_guide',
      title: 'Certified Mount Batur Sunrise Trekting',
      location: 'Kintamani, Bali',
      price: 65,
      status: 'active',
      totalBookings: 89,
      rating: 4.8,
      revenue: 5785,
      availableUnits: 25,
      images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600'],
    },
    {
      id: 'prt_3',
      partnerType: 'travel_agency',
      title: '7-Day Complete Bali Cultural Circuit',
      location: 'Denpasar, Bali',
      price: 799,
      status: 'active',
      totalBookings: 34,
      rating: 4.95,
      revenue: 27166,
      availableUnits: 8,
      images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600'],
    },
    {
      id: 'prt_4',
      partnerType: 'bus_operator',
      title: 'Express Volvo AC Sleeper Service',
      location: 'Denpasar to Singaraja',
      price: 24,
      status: 'active',
      totalBookings: 310,
      rating: 4.6,
      revenue: 7440,
      availableUnits: 18,
      images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600'],
    },
  ]);

  // Sample partner bookings
  const [partnerBookings, setPartnerBookings] = useState<PartnerBooking[]>([
    {
      id: 'PB-9081',
      customerName: 'Sarah Jenkins',
      serviceTitle: 'Grand Palace Luxury Resort & Spa (Deluxe Pool Villa)',
      date: 'Aug 10 - Aug 14, 2026',
      amount: 720,
      status: 'Confirmed',
      paymentStatus: 'Paid',
    },
    {
      id: 'PB-9082',
      customerName: 'David Kalu',
      serviceTitle: 'Certified Mount Batur Sunrise Trekting',
      date: 'Aug 12, 2026',
      amount: 130,
      status: 'Confirmed',
      paymentStatus: 'Paid',
    },
    {
      id: 'PB-9083',
      customerName: 'Elena Rostova',
      serviceTitle: 'Express Volvo AC Sleeper Service',
      date: 'Aug 15, 2026',
      amount: 48,
      status: 'Completed',
      paymentStatus: 'Paid',
    },
  ]);

  // Sample reviews to respond to
  const [partnerReviews, setPartnerReviews] = useState([
    {
      id: 'rev_1',
      customerName: 'Michael Chang',
      rating: 5,
      date: '2 days ago',
      comment: 'Absolutely breathtaking stay! Staff were exceptionally warm and hospitable.',
      response: 'Thank you Michael! We look forward to hosting you again soon.',
    },
    {
      id: 'rev_2',
      customerName: 'Aria Thompson',
      rating: 4,
      date: '5 days ago',
      comment: 'The sunrise guide was knowledgeable, though breakfast could have more options.',
      response: '',
    },
  ]);

  // New listing modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPrice, setNewPrice] = useState(100);
  const [newUnits, setNewUnits] = useState(10);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const filteredListings = listings.filter((l) => l.partnerType === partnerType);

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const item: PartnerListing = {
      id: `prt_${Date.now()}`,
      partnerType,
      title: newTitle,
      location: newLocation || 'Bali Central',
      price: Number(newPrice),
      status: 'active',
      totalBookings: 0,
      rating: 5.0,
      revenue: 0,
      availableUnits: Number(newUnits),
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600'],
    };

    setListings([item, ...listings]);
    setShowAddModal(false);
    setNewTitle('');
    setNewLocation('');
  };

  const handleRespondReview = (id: string) => {
    const text = replyText[id];
    if (!text) return;
    setPartnerReviews(
      partnerReviews.map((r) => (r.id === id ? { ...r, response: text } : r))
    );
    setReplyText({ ...replyText, [id]: '' });
  };

  const totalPartnerRevenue = filteredListings.reduce((sum, item) => sum + item.revenue, 0);
  const totalPartnerBookings = filteredListings.reduce((sum, item) => sum + item.totalBookings, 0);

  return (
    <div id="partner-portal-module" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Partner Branding Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                COMMERCIAL VENDOR PORTAL
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Enterprise Partner
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              VoyageGo Partner Management Console
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Manage inventory, optimize seasonal pricing, handle guest bookings & track commercial payout analytics across all merchant services.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all w-fit"
          >
            <Plus className="w-4 h-4" /> Add New Inventory Listing
          </button>
        </div>
      </div>

      {/* Partner Type Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setPartnerType('hotel')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
            partnerType === 'hotel'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4 text-orange-400" />
          Hotel &amp; Resort Merchant
        </button>

        <button
          onClick={() => setPartnerType('tour_guide')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
            partnerType === 'tour_guide'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-400" />
          Tour Guide &amp; Activities
        </button>

        <button
          onClick={() => setPartnerType('travel_agency')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
            partnerType === 'travel_agency'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Briefcase className="w-4 h-4 text-emerald-400" />
          Travel Agency &amp; Packages
        </button>

        <button
          onClick={() => setPartnerType('bus_operator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
            partnerType === 'bus_operator'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Bus className="w-4 h-4 text-rose-400" />
          Bus Operator &amp; Fleet
        </button>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Total Revenue Earned</span>
          <p className="text-2xl font-extrabold text-slate-900">${totalPartnerRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-bold">↑ +18.4% vs last month</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Confirmed Bookings</span>
          <p className="text-2xl font-extrabold text-slate-900">{totalPartnerBookings}</p>
          <span className="text-[10px] text-orange-600 font-bold">100% Payout Verified</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Active Inventory Units</span>
          <p className="text-2xl font-extrabold text-slate-900">
            {filteredListings.reduce((s, i) => s + i.availableUnits, 0)} Units
          </p>
          <span className="text-[10px] text-slate-500 font-bold">Ready for instant book</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Average Guest Rating</span>
          <p className="text-2xl font-extrabold text-slate-900 flex items-center gap-1">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            4.88 / 5.0
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">Top 5% Partner Badge</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl w-fit flex gap-1 border border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'listings' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Listings ({filteredListings.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'bookings' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Guest Bookings ({partnerBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('revenue')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'revenue' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Revenue &amp; Payouts
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'reviews' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Guest Reviews ({partnerReviews.length})
        </button>
      </div>

      {/* TAB CONTENT 1: LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs p-5 space-y-4">
                <div className="h-44 rounded-2xl overflow-hidden relative">
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-xl">
                    ${listing.price} / unit
                  </span>
                  <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg">
                    {listing.status.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{listing.title}</h3>
                  <p className="text-xs text-slate-500">{listing.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Bookings</span>
                    <strong className="text-slate-900">{listing.totalBookings} orders</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Revenue</span>
                    <strong className="text-orange-600">${listing.revenue.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="flex gap-2 text-xs font-bold pt-2">
                  <button
                    onClick={() => {
                      const newP = prompt('Update price per night/unit ($):', listing.price.toString());
                      if (newP) {
                        setListings(listings.map((l) => (l.id === listing.id ? { ...l, price: Number(newP) } : l)));
                      }
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-center flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Price
                  </button>
                  <button
                    onClick={() => {
                      const newA = prompt('Update available units/seats:', listing.availableUnits.toString());
                      if (newA) {
                        setListings(listings.map((l) => (l.id === listing.id ? { ...l, availableUnits: Number(newA) } : l)));
                      }
                    }}
                    className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-600 py-2 rounded-xl text-center"
                  >
                    Units: {listing.availableUnits}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Listing Service</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Payout Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {partnerBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-mono font-bold text-orange-600">{b.id}</td>
                  <td className="p-4 font-bold text-slate-800">{b.customerName}</td>
                  <td className="p-4 text-slate-700">{b.serviceTitle}</td>
                  <td className="p-4 text-slate-500">{b.date}</td>
                  <td className="p-4 font-bold text-slate-900">${b.amount}</td>
                  <td className="p-4">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT 3: REVENUE */}
      {activeTab === 'revenue' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Commercial Payout Ledger &amp; Trends</h3>
              <p className="text-xs text-slate-500">Automated bi-weekly payouts via bank direct deposit or Stripe</p>
            </div>
            <button
              onClick={() => alert('Exporting Commercial Revenue Report (CSV format)...')}
              className="bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs"
            >
              Export CSV Report
            </button>
          </div>

          <div className="h-44 bg-slate-50 rounded-2xl border border-slate-200 p-4 flex items-end justify-between gap-3">
            {[
              { month: 'Feb', val: 12400 },
              { month: 'Mar', val: 18900 },
              { month: 'Apr', val: 24500 },
              { month: 'May', val: 31200 },
              { month: 'Jun', val: 42000 },
              { month: 'Jul', val: 56345 },
            ].map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-slate-600">${(d.val / 1000).toFixed(1)}k</span>
                <div
                  style={{ height: `${(d.val / 60000) * 100}%` }}
                  className="w-full bg-gradient-to-t from-orange-600 to-amber-400 rounded-t-xl"
                ></div>
                <span className="text-xs font-bold text-slate-700">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {partnerReviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-xs">
                    {rev.customerName[0]}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 text-xs">{rev.customerName}</p>
                    <p className="text-[10px] text-slate-400">{rev.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>

              {rev.response ? (
                <div className="bg-orange-50/80 p-3 rounded-2xl border border-orange-200 text-xs space-y-1">
                  <span className="font-bold text-orange-800 text-[10px] block">Your Merchant Response:</span>
                  <p className="text-slate-700">{rev.response}</p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write an official merchant reply..."
                    value={replyText[rev.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => handleRespondReview(rev.id)}
                    className="bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    Post Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Inventory Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddListing} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900">Add {partnerType.toUpperCase()} Inventory Listing</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-500">✕</button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Service / Title</label>
              <input
                type="text"
                placeholder="e.g. Deluxe Garden Villa / Sunset Catamaran Tour"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Seminyak Beachfront, Bali"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Price per Unit ($)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Available Units / Seats</label>
                <input
                  type="number"
                  value={newUnits}
                  onChange={(e) => setNewUnits(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-orange-500 text-white font-bold text-xs py-3 rounded-xl shadow-md">
              Publish Inventory to VoyageGo Marketplace
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
