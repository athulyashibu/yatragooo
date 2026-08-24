import React, { useState } from 'react';
import { fetchBookingReceipt, downloadReceiptPDF, triggerPrintReceipt } from '../../utils/receiptGenerator';
import {
  X,
  FileText,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  CreditCard,
  Ticket,
  Clock,
  Download,
  Share2,
  DollarSign,
  Ban,
  Tag,
  Gift,
  Printer,
} from 'lucide-react';
import { Booking } from '../../types';

interface AdminBookingDetailModalProps {
  booking: Booking;
  onClose: () => void;
  onUpdateStatus: (pnr: string, status: 'Confirmed' | 'Cancelled' | 'Refunded') => void;
  onUpdateBooking?: (updatedBooking: Booking) => void;
  onShowToast: (msg: string) => void;
}

export const AdminBookingDetailModal: React.FC<AdminBookingDetailModalProps> = ({
  booking,
  onClose,
  onUpdateStatus,
  onUpdateBooking,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'invoice' | 'timeline' | 'actions'>('itinerary');

  // Modification state
  const [isModifying, setIsModifying] = useState(false);
  const [newTravelDate, setNewTravelDate] = useState(booking.travelDate);
  const [newPassengerName, setNewPassengerName] = useState(booking.passengerName);
  const [newSeatRoom, setNewSeatRoom] = useState(booking.details?.seat || booking.details?.guests || '');

  const handleSaveModification = () => {
    if (onUpdateBooking) {
      onUpdateBooking({
        ...booking,
        travelDate: newTravelDate,
        passengerName: newPassengerName,
        details: {
          ...booking.details,
          seat: newSeatRoom,
        },
      });
    }
    setIsModifying(false);
    onShowToast(`Booking ${booking.pnr} updated successfully.`);
  };

  const handleResendInvoice = () => {
    onShowToast(`Invoice & VAT Receipt for PNR ${booking.pnr} dispatched to ${booking.passengerEmail}.`);
  };

  const handleResendTicket = () => {
    onShowToast(`Digital Boarding Pass & QR Ticket for PNR ${booking.pnr} sent via SMS and Email.`);
  };

  const handleApproveRefund = () => {
    onUpdateStatus(booking.pnr, 'Refunded');
    onShowToast(`Refund of $${booking.amount.toFixed(2)} approved for PNR ${booking.pnr}. Credited to original payment mode.`);
  };

  const handleRejectRefund = () => {
    onShowToast(`Refund request for PNR ${booking.pnr} marked as rejected after audit review.`);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-orange-400 bg-orange-950 px-2.5 py-1 rounded-md">
                PNR: {booking.pnr}
              </span>
              <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md">
                {booking.type}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  booking.status === 'Confirmed'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : booking.status === 'Completed'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {booking.status}
              </span>
            </div>
            <h2 className="text-xl font-extrabold mt-1 text-white">{booking.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{booking.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResendTicket}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Resend Ticket
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Header */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'itinerary' ? 'bg-white text-orange-600 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Itinerary &amp; Passengers
          </button>
          <button
            onClick={() => setActiveTab('invoice')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'invoice' ? 'bg-white text-orange-600 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Invoice &amp; Receipt
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'timeline' ? 'bg-white text-orange-600 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Booking Timeline
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'actions' ? 'bg-white text-orange-600 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Management Actions
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              {/* Core Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                    <User className="w-4 h-4 text-orange-500" /> Passenger Details
                  </h3>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-slate-400 font-medium">Primary Traveler:</span>
                      <span className="font-bold text-slate-900 ml-1">{booking.passengerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Contact Email:</span>
                      <span className="font-mono text-slate-800 ml-1">{booking.passengerEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">User ID Linked:</span>
                      <span className="font-mono text-slate-800 ml-1">{booking.userId}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                    <Calendar className="w-4 h-4 text-orange-500" /> Travel Schedule
                  </h3>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-slate-400 font-medium">Booking Date:</span>
                      <span className="font-mono text-slate-800 ml-1">{booking.bookingDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Travel Date:</span>
                      <span className="font-mono font-bold text-slate-900 ml-1">{booking.travelDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Destination:</span>
                      <span className="font-bold text-slate-800 ml-1">{booking.destination || booking.subtitle}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details Breakdown */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs">
                <h3 className="font-extrabold text-slate-900 text-sm">Specific Service Specs</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  {Object.entries(booking.details || {}).map(([key, val]) => (
                    <div key={key} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{key}</span>
                      <span className="font-bold text-slate-800">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Code Security Data */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">Boarding Barcode Data</span>
                  <span className="font-mono text-slate-300 font-bold">{booking.qrCodeData}</span>
                </div>
                <Ticket className="w-8 h-8 text-orange-400 opacity-80" />
              </div>
            </div>
          )}

          {activeTab === 'invoice' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-6 text-xs">
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">VOYAGEGO OFFICIAL INVOICE</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Transaction ID: {booking.details?.transactionId || 'TXN-9081231'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const r = await fetchBookingReceipt(booking.pnr || booking.id);
                          downloadReceiptPDF(r);
                          onShowToast(`Downloaded PDF Receipt for PNR ${booking.pnr}.`);
                        } catch (err: any) {
                          onShowToast(err.message || 'Receipt is not available.');
                        }
                      }}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-orange-400" /> Download PDF
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const r = await fetchBookingReceipt(booking.pnr || booking.id);
                          triggerPrintReceipt(r);
                        } catch (err: any) {
                          onShowToast(err.message || 'Receipt is not available.');
                        }
                      }}
                      className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Receipt
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-600">Base Fare / Reservation Rate</span>
                    <span className="font-mono font-bold">${(booking.amount * 0.88).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-600">Airport Taxes &amp; Aviation Surcharges</span>
                    <span className="font-mono font-bold">${(booking.amount * 0.12).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-base font-black text-slate-900 pt-2">
                    <span>Total Paid</span>
                    <span className="font-mono text-emerald-600">${booking.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-400 font-medium block">Payment Method</span>
                    <span className="font-bold text-slate-800">{booking.details?.paymentMethod || 'Credit Card'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Payment Status</span>
                    <span className="font-bold text-emerald-600">{booking.paymentStatus || 'Paid'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm">Booking Event Audit Timeline</h3>
              <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 text-xs">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
                  <div className="font-bold text-slate-900">Booking Confirmed &amp; Payment Processed</div>
                  <div className="text-[11px] text-slate-500 font-mono">{booking.bookingDate} 10:30 AM • Transaction ID: TXN-908123</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-100"></div>
                  <div className="font-bold text-slate-900">E-Ticket &amp; Confirmation Issued</div>
                  <div className="text-[11px] text-slate-500 font-mono">{booking.bookingDate} 10:31 AM • Dispatched to {booking.passengerEmail}</div>
                </div>
                {booking.status === 'Cancelled' && (
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-rose-500 ring-4 ring-rose-100"></div>
                    <div className="font-bold text-rose-700">Booking Cancelled &amp; Refund Triggered</div>
                    <div className="text-[11px] text-slate-500 font-mono">Audit Logged • Refund processed to origin payment</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm">Administrative Interventions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsModifying(true)}
                    className="p-3 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 hover:border-orange-500 hover:text-orange-600 transition-all text-left"
                  >
                    Modify Schedule / Passenger Details
                  </button>
                  <button
                    onClick={() => onUpdateStatus(booking.pnr, 'Cancelled')}
                    className="p-3 bg-white border border-rose-200 rounded-xl font-bold text-rose-600 hover:bg-rose-50 transition-all text-left"
                  >
                    Cancel Booking &amp; Issue Refund
                  </button>
                  <button
                    onClick={handleApproveRefund}
                    className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-emerald-700 hover:bg-emerald-100 transition-all text-left"
                  >
                    Approve Pending Refund Request
                  </button>
                  <button
                    onClick={handleRejectRefund}
                    className="p-3 bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-200 transition-all text-left"
                  >
                    Reject Refund Request
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Modal Sub-dialog */}
        {isModifying && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="font-extrabold text-slate-900 text-base">Modify Booking Specs: {booking.pnr}</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Travel Date</label>
                  <input
                    type="text"
                    value={newTravelDate}
                    onChange={(e) => setNewTravelDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Passenger Name</label>
                  <input
                    type="text"
                    value={newPassengerName}
                    onChange={(e) => setNewPassengerName(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Seat / Room Specs</label>
                  <input
                    type="text"
                    value={newSeatRoom}
                    onChange={(e) => setNewSeatRoom(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setIsModifying(false)} className="px-3 py-2 bg-slate-100 font-bold text-slate-600 rounded-xl">
                    Cancel
                  </button>
                  <button onClick={handleSaveModification} className="px-4 py-2 bg-orange-600 text-white font-bold rounded-xl">
                    Save Modification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
