import React, { useState, useEffect } from 'react';
import { fetchBookingReceipt, downloadReceiptPDF, triggerPrintReceipt } from '../../utils/receiptGenerator';
import {
  ShieldCheck,
  Ticket,
  Wallet,
  Tag,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  QrCode,
  Coins,
  Smartphone,
  Building2,
  Gift,
  RefreshCw,
  AlertCircle,
  Download,
  Printer,
  Mail,
  Check,
  Search,
  Lock,
  ChevronRight,
  X,
  Copy,
} from 'lucide-react';
import { Booking, Coupon, UserProfile } from '../../types';

interface CheckoutModalProps {
  itemToBook: {
    type: 'Flight' | 'Hotel' | 'Homestay' | 'Package' | 'Bus' | 'Train' | 'Cab' | 'Experience';
    title: string;
    subtitle: string;
    price: number;
    details: Record<string, any>;
  } | null;
  user: UserProfile;
  coupons: Coupon[];
  onClose: () => void;
  onConfirmBooking: (newBooking: Booking) => void;
}

type Step = 'review' | 'payment' | 'processing' | 'success' | 'failed';
type PaymentMethodCategory = 'upi' | 'card' | 'debit' | 'netbanking' | 'wallet' | 'giftcard';

// List of supported Net Banking Banks
const NET_BANKING_BANKS = [
  { id: 'sbi', name: 'State Bank of India (SBI)', popular: true, logo: '🏛️' },
  { id: 'hdfc', name: 'HDFC Bank', popular: true, logo: '🏦' },
  { id: 'icici', name: 'ICICI Bank', popular: true, logo: '🏛️' },
  { id: 'axis', name: 'Axis Bank', popular: true, logo: '🏦' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', popular: true, logo: '🏛️' },
  { id: 'pnb', name: 'Punjab National Bank (PNB)', popular: true, logo: '🏦' },
  { id: 'canara', name: 'Canara Bank', popular: false, logo: '🏛️' },
  { id: 'bob', name: 'Bank of Baroda', popular: false, logo: '🏦' },
  { id: 'idfc', name: 'IDFC FIRST Bank', popular: false, logo: '🏛️' },
  { id: 'union', name: 'Union Bank of India', popular: false, logo: '🏛️' },
  { id: 'indian', name: 'Indian Bank', popular: false, logo: '🏦' },
  { id: 'federal', name: 'Federal Bank', popular: false, logo: '🏛️' },
  { id: 'sib', name: 'South Indian Bank', popular: false, logo: '🏦' },
  { id: 'yes', name: 'Yes Bank', popular: false, logo: '🏛️' },
];

// Digital Wallets Data
const WALLETS_LIST = [
  { id: 'amazonpay', name: 'Amazon Pay', balance: 120.00, logo: '📦' },
  { id: 'paytm', name: 'Paytm Wallet', balance: 85.50, logo: '📱' },
  { id: 'phonepe', name: 'PhonePe Wallet', balance: 45.00, logo: '🟣' },
  { id: 'mobikwik', name: 'MobiKwik Wallet', balance: 60.00, logo: '⚡' },
];

// UPI Apps Data
const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', handle: '@okaxis', color: 'from-blue-500 to-emerald-500' },
  { id: 'phonepe', name: 'PhonePe', handle: '@ybl', color: 'from-purple-600 to-indigo-600' },
  { id: 'paytm', name: 'Paytm UPI', handle: '@paytm', color: 'from-sky-500 to-blue-600' },
  { id: 'bhim', name: 'BHIM UPI', handle: '@upi', color: 'from-amber-500 to-orange-600' },
  { id: 'amazon', name: 'Amazon Pay UPI', handle: '@apl', color: 'from-amber-600 to-yellow-500' },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  itemToBook,
  user,
  coupons,
  onClose,
  onConfirmBooking,
}) => {
  if (!itemToBook) return null;

  // Checkout Steps
  const [currentStep, setCurrentStep] = useState<Step>('review');

  // Passenger & Contact Details
  const [passengerName, setPassengerName] = useState(user.name);
  const [passengerEmail, setPassengerEmail] = useState(user.email);
  const [passengerPhone, setPassengerPhone] = useState(user.phone);

  // Discounts & Wallet state
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [useWallet, setUseWallet] = useState(false);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState('');
  const [appliedGiftCard, setAppliedGiftCard] = useState<number>(0);
  const [giftCardMsg, setGiftCardMsg] = useState('');

  // Payment Selection State
  const [paymentCategory, setPaymentCategory] = useState<PaymentMethodCategory>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Card Form State (Credit & Debit)
  const [cardHolder, setCardHolder] = useState(user.name);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('sbi');
  const [bankSearch, setBankSearch] = useState('');

  // Wallet State
  const [selectedWallet, setSelectedWallet] = useState('amazonpay');

  // Processing & Confirmation State
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatusText, setProcessingStatusText] = useState('Connecting to payment gateway...');
  const [generatedBookingId, setGeneratedBookingId] = useState('');
  const [generatedPnr, setGeneratedPnr] = useState('');
  const [generatedTxnId, setGeneratedTxnId] = useState('');
  const [transactionTime, setTransactionTime] = useState('');
  const [failureReason, setFailureReason] = useState('Bank server timeout or invalid OTP entry');

  // Email Notification Toast State
  const [showEmailToast, setShowEmailToast] = useState(false);

  // Brand detection for credit cards
  const getCardBrand = (num: string) => {
    const cleaned = num.replace(/\s+/g, '');
    if (cleaned.startsWith('4')) return { name: 'Visa', logo: '💳 Visa' };
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return { name: 'Mastercard', logo: '💳 Mastercard' };
    if (/^3[47]/.test(cleaned)) return { name: 'American Express', logo: '💳 AMEX' };
    if (/^60|^65|^35/.test(cleaned)) return { name: 'RuPay', logo: '💳 RuPay' };
    return { name: 'Card', logo: '💳 Credit/Debit' };
  };

  const cardBrand = getCardBrand(cardNumber);

  // Discount Calculations
  const taxesAndFee = Math.round(itemToBook.price * 0.12); // 12% mock tax & GST
  
  let promoDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'flat') {
      promoDiscount = appliedCoupon.discountValue;
    } else {
      promoDiscount = Math.round((itemToBook.price * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && promoDiscount > appliedCoupon.maxDiscount) {
        promoDiscount = appliedCoupon.maxDiscount;
      }
    }
  }

  // Loyalty coins conversion: 500 coins = $5 discount
  const loyaltyDiscount = useLoyaltyPoints ? Math.min(15, Math.floor(user.voyageCoins / 100)) : 0;
  
  const subtotalAfterDiscounts = Math.max(0, itemToBook.price + taxesAndFee - promoDiscount - loyaltyDiscount - appliedGiftCard);

  let walletDeduction = 0;
  if (useWallet) {
    walletDeduction = Math.min(user.walletBalance, subtotalAfterDiscounts);
  }

  const finalPayable = Math.max(0, subtotalAfterDiscounts - walletDeduction);

  // Handle Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const found = coupons.find((c) => c.code === couponInput.toUpperCase());
    if (found) {
      setAppliedCoupon(found);
    } else {
      alert('Invalid coupon code. Try VOYAGEFLY50 or SUMMER2026!');
    }
  };

  // Handle Apply Gift Card
  const handleApplyGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (giftCardCode.toUpperCase() === 'VOYAGE50' || giftCardCode.toUpperCase() === 'GIFT25') {
      const amount = giftCardCode.toUpperCase() === 'VOYAGE50' ? 50 : 25;
      setAppliedGiftCard(amount);
      setGiftCardMsg(`✓ $${amount} Gift Voucher Applied Successfully!`);
    } else {
      setGiftCardMsg('❌ Invalid Gift Card Code. Try VOYAGE50 or GIFT25!');
    }
  };

  // Trigger Payment Processing Flow
  const handleInitiatePayment = () => {
    setCurrentStep('processing');
    setProcessingProgress(0);
    setProcessingStatusText('Securing connection with bank server...');

    const pnr = `VG-${Math.floor(100000 + Math.random() * 900000)}`;
    const bkId = `BK-${Date.now()}`;
    const txn = `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const nowStr = new Date().toLocaleString();

    setGeneratedPnr(pnr);
    setGeneratedBookingId(bkId);
    setGeneratedTxnId(txn);
    setTransactionTime(nowStr);

    // Animate loading simulation (2.5 seconds total)
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setProcessingProgress(progress);

      if (progress === 40) {
        setProcessingStatusText('Verifying payment credentials & 3D Secure OTP...');
      } else if (progress === 80) {
        setProcessingStatusText('Authorizing transaction with bank gateway...');
      } else if (progress >= 100) {
        clearInterval(interval);
        
        // Randomize 90% Success / 10% Failure outcome (can be retried)
        const isSuccessful = Math.random() > 0.1;

        if (isSuccessful) {
          setCurrentStep('success');
          setShowEmailToast(true);

          const newBooking: Booking = {
            id: bkId,
            pnr,
            userId: user.id, // Linked authenticated User ID
            bookingDate: new Date().toISOString().split('T')[0],
            travelDate: '2026-08-20',
            type: itemToBook.type,
            title: itemToBook.title,
            subtitle: itemToBook.subtitle,
            amount: finalPayable,
            status: 'Confirmed',
            passengerName,
            passengerEmail,
            details: {
              ...itemToBook.details,
              transactionId: txn,
              paymentMethod: paymentCategory.toUpperCase(),
            },
            qrCodeData: `VOYAGEGO-${itemToBook.type.toUpperCase()}-${pnr}-${passengerName.toUpperCase()}`,
            image: itemToBook.details?.image || undefined,
            destination: itemToBook.details?.destination || itemToBook.subtitle.split('•')[0]?.trim() || itemToBook.title,
            paymentStatus: 'Paid',
          };

          // Post booking to backend API with JWT Authorization header
          const jwtToken = localStorage.getItem('voyagego_auth_token') || '';
          fetch('/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(newBooking),
          }).catch((err) => console.error('Failed to sync booking to backend API:', err));

          onConfirmBooking(newBooking);
        } else {
          setFailureReason('Bank server connection timed out. Please try again or choose another payment method.');
          setCurrentStep('failed');
        }
      }
    }, 500);
  };

  return (
    <div id="checkout-modal-overlay" className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      {/* Toast Notification for Mock Email */}
      {showEmailToast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-orange-500/40 max-w-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-5 duration-300">
          <Mail className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="block text-orange-300 font-extrabold">E-Ticket Emailed!</strong>
            <p className="text-slate-300 mt-0.5">
              Confirmation receipt &amp; boarding voucher sent to <strong>{passengerEmail}</strong>.
            </p>
          </div>
          <button onClick={() => setShowEmailToast(false)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto border border-slate-100 relative my-6">
        {/* Modal Header Bar */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-orange-700 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                VOYAGEGO SECURE GATEWAY
              </span>
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-500" /> 256-Bit SSL Encrypted
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              {currentStep === 'review' && 'Review Booking &amp; Traveller Info'}
              {currentStep === 'payment' && 'Select Payment Method'}
              {currentStep === 'processing' && 'Processing Transaction...'}
              {currentStep === 'success' && 'Booking Confirmed &amp; Payment Successful!'}
              {currentStep === 'failed' && 'Transaction Failed'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Step Progress Breadcrumbs */}
        <div className="flex items-center justify-between text-xs font-bold border-b border-slate-100 pb-3">
          <div className={`flex items-center gap-1.5 ${currentStep === 'review' ? 'text-orange-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep === 'review' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span>Review</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${currentStep === 'payment' ? 'text-orange-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep === 'payment' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span>Payment</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${currentStep === 'success' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* ================= STEP 1: REVIEW & TRAVELLER DETAILS ================= */}
        {currentStep === 'review' && (
          <div className="space-y-6">
            {/* Booking Overview Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                  {itemToBook.type}
                </span>
                <h4 className="font-extrabold text-slate-900 text-base mt-1">{itemToBook.title}</h4>
                <p className="text-xs text-slate-600">{itemToBook.subtitle}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">Base Price</span>
                <span className="text-xl font-extrabold text-slate-900">${itemToBook.price}</span>
              </div>
            </div>

            {/* Traveller Form */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                Primary Traveller Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Discounts, Loyalty & Gift Cards */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                Coupons, Gift Cards &amp; Loyalty Rewards
              </h4>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. VOYAGEFLY50 or SUMMER2026)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <button type="submit" className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-slate-800">
                  Apply Coupon
                </button>
              </form>

              {appliedCoupon && (
                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-800 font-bold flex justify-between items-center">
                  <span>✓ Promo {appliedCoupon.code} Applied (-${promoDiscount})</span>
                  <button onClick={() => setAppliedCoupon(null)} className="text-rose-600 text-[10px]">Remove</button>
                </div>
              )}

              {/* Gift Card Code Input */}
              <form onSubmit={handleApplyGiftCard} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Gift Voucher Code (e.g. VOYAGE50)"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <button type="submit" className="bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-amber-700">
                  Redeem Gift Card
                </button>
              </form>

              {giftCardMsg && <p className="text-xs font-bold text-amber-800 bg-amber-50 p-2 rounded-xl">{giftCardMsg}</p>}

              {/* Loyalty Coins & Wallet Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                  <input
                    type="checkbox"
                    checked={useLoyaltyPoints}
                    onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>Redeem {user.voyageCoins} Voyage Coins (${loyaltyDiscount} Off)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-orange-50/70 p-3 rounded-xl border border-orange-200">
                  <input
                    type="checkbox"
                    checked={useWallet}
                    onChange={(e) => setUseWallet(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-400"
                  />
                  <span>Use Voyage Wallet (${user.walletBalance.toFixed(2)} Available)</span>
                </label>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-2 text-xs font-semibold">
              <div className="flex justify-between text-slate-400">
                <span>Base Item Amount</span>
                <span>${itemToBook.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Taxes &amp; Service Charge (12%)</span>
                <span>+${taxesAndFee.toFixed(2)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Coupon Discount</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              {appliedGiftCard > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Gift Voucher Discount</span>
                  <span>-${appliedGiftCard.toFixed(2)}</span>
                </div>
              )}
              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>Voyage Coins Reward</span>
                  <span>-${loyaltyDiscount.toFixed(2)}</span>
                </div>
              )}
              {walletDeduction > 0 && (
                <div className="flex justify-between text-orange-400">
                  <span>Voyage Wallet Credit</span>
                  <span>-${walletDeduction.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Total Payable Amount</span>
                <span className="text-orange-400">${finalPayable.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('payment')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Payment (${finalPayable.toFixed(2)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= STEP 2: SELECT PAYMENT METHOD ================= */}
        {currentStep === 'payment' && (
          <div className="space-y-6">
            {/* Amount Banner */}
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-500 font-semibold">Paying For:</span>
                <p className="font-extrabold text-slate-900 text-sm">{itemToBook.title}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-semibold text-[10px]">TOTAL AMOUNT</span>
                <p className="font-extrabold text-orange-600 text-lg">${finalPayable.toFixed(2)}</p>
              </div>
            </div>

            {/* Payment Category Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setPaymentCategory('upi')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  paymentCategory === 'upi' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4 text-orange-400" /> UPI Instant Pay
              </button>

              <button
                onClick={() => setPaymentCategory('card')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  paymentCategory === 'card' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4 text-orange-400" /> Credit Card
              </button>

              <button
                onClick={() => setPaymentCategory('debit')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  paymentCategory === 'debit' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-400" /> Debit Card
              </button>

              <button
                onClick={() => setPaymentCategory('netbanking')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  paymentCategory === 'netbanking' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-400" /> Net Banking
              </button>

              <button
                onClick={() => setPaymentCategory('wallet')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  paymentCategory === 'wallet' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Wallet className="w-4 h-4 text-amber-400" /> Digital Wallets
              </button>
            </div>

            {/* PAYMENT CATEGORY DETAIL FORMS */}
            
            {/* 1. UPI Payment */}
            {paymentCategory === 'upi' && (
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-600">
                  Select UPI App or Enter Virtual Payment Address (VPA)
                </h4>

                {/* Popular UPI Apps Quick Select */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => {
                        setSelectedUpiApp(app.id);
                        setCustomUpiId(`${passengerEmail.split('@')[0]}${app.handle}`);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedUpiApp === app.id ? 'bg-white border-orange-500 ring-2 ring-orange-400/30' : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-extrabold text-slate-800">{app.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{app.handle}</span>
                    </button>
                  ))}
                </div>

                {/* Manual UPI VPA Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter UPI ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. mobileNumber@upi or username@okicici"
                      value={customUpiId}
                      onChange={(e) => setCustomUpiId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* QR Code Payment Simulation */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsQrModalOpen(!isQrModalOpen)}
                    className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>{isQrModalOpen ? 'Hide Scan QR Code' : 'Scan QR Code to Pay from Any App'}</span>
                  </button>

                  {isQrModalOpen && (
                    <div className="mt-3 bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-2">
                      <QrCode className="w-32 h-32 mx-auto text-slate-800" />
                      <p className="text-[11px] font-mono text-slate-500">Scan with GPay, PhonePe, Paytm, BHIM</p>
                      <span className="inline-block text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        QR Code expires in 04:59 mins
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2 & 3. Credit / Debit Cards Form */}
            {(paymentCategory === 'card' || paymentCategory === 'debit') && (
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-600">
                    Enter {paymentCategory === 'card' ? 'Credit' : 'Debit'} Card Information
                  </h4>
                  <span className="text-xs font-extrabold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                    {cardBrand.logo}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4532 •••• •••• 8912"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="08/29"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVV Security Code</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="rounded text-orange-500 focus:ring-orange-400"
                  />
                  <span>Save card securely for 1-click future checkout (Tokenized)</span>
                </label>
              </div>
            )}

            {/* 4. Net Banking */}
            {paymentCategory === 'netbanking' && (
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-600">
                  Select Your Internet Banking Bank
                </h4>

                {/* Popular Banks Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {NET_BANKING_BANKS.filter((b) => b.popular).map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBank(bank.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                        selectedBank === bank.id ? 'bg-white border-emerald-500 ring-2 ring-emerald-400/30' : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-base">{bank.logo}</span>
                      <span className="text-xs font-extrabold text-slate-800">{bank.name}</span>
                    </button>
                  ))}
                </div>

                {/* Searchable Dropdown for All Banks */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Search Other Supported Banks</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      {NET_BANKING_BANKS.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Digital Wallets */}
            {paymentCategory === 'wallet' && (
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-600">
                  Select Digital Wallet Partner
                </h4>

                <div className="space-y-2">
                  {WALLETS_LIST.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setSelectedWallet(w.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedWallet === w.id ? 'bg-white border-amber-500 ring-2 ring-amber-400/30' : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{w.logo}</span>
                        <strong className="text-xs font-extrabold text-slate-800">{w.name}</strong>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Linked Balance: ${w.balance.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('review')}
                className="px-5 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleInitiatePayment}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Authorise &amp; Pay ${finalPayable.toFixed(2)}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PROCESSING SCREEN ================= */}
        {currentStep === 'processing' && (
          <div className="py-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-inner relative animate-pulse">
              <RefreshCw className="w-10 h-10 animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">Processing Your Payment</h3>
              <p className="text-xs text-slate-500 font-medium">{processingStatusText}</p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto space-y-1">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{processingProgress}% Complete</span>
            </div>

            <p className="text-[11px] text-slate-400 italic">Please do not refresh the page or press back.</p>
          </div>
        )}

        {/* ================= STEP 4: SUCCESS CONFIRMATION & RECEIPT ================= */}
        {currentStep === 'success' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Payment &amp; Reservation Confirmed!</h3>
              <p className="text-xs text-slate-500">Your trip is officially booked. Below is your official receipt.</p>
            </div>

            {/* Printable Payment Receipt Card */}
            <div id="printable-receipt" className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[9px] font-extrabold text-orange-600 uppercase tracking-widest">TRANSACTION RECEIPT</span>
                  <h4 className="font-extrabold text-slate-900 text-base">{itemToBook.title}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    STATUS: PAID
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">{transactionTime}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Booking ID</span>
                  <strong className="font-mono text-slate-800">{generatedBookingId}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">PNR Reference</span>
                  <strong className="font-mono text-orange-600">{generatedPnr}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Transaction ID</span>
                  <strong className="font-mono text-slate-800">{generatedTxnId}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Payment Method</span>
                  <strong className="capitalize text-slate-800">{paymentCategory}</strong>
                </div>
              </div>

              {/* Receipt Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-700 font-medium pt-1">
                <div className="flex justify-between">
                  <span>Base Item Price</span>
                  <span>${itemToBook.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST &amp; Travel Taxes</span>
                  <span>+${taxesAndFee.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Promo Coupon ({appliedCoupon?.code})</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                {walletDeduction > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Voyage Wallet Credit</span>
                    <span>-${walletDeduction.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>Net Amount Paid</span>
                  <span className="text-orange-600">${finalPayable.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Download PDF, Print Receipt, Finish */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const r = await fetchBookingReceipt(generatedPnr || generatedBookingId);
                    downloadReceiptPDF(r);
                  } catch (err: any) {
                    alert(err.message || 'Receipt is not available.');
                  }
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-200 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4 text-orange-500" /> Download PDF Receipt
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const r = await fetchBookingReceipt(generatedPnr || generatedBookingId);
                    triggerPrintReceipt(r);
                  } catch (err: any) {
                    alert(err.message || 'Receipt is not available.');
                  }
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-200 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-600" /> Print Receipt
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                View in My Bookings
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: FAILED PAYMENT SCENARIO ================= */}
        {currentStep === 'failed' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-md">
              <AlertCircle className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">Payment Unsuccessful</h3>
            <p className="text-xs text-rose-600 font-bold bg-rose-50 p-3 rounded-xl max-w-md mx-auto">
              {failureReason}
            </p>

            <p className="text-xs text-slate-500">
              Your booking reservation details have been saved. You can retry payment immediately or select another payment option.
            </p>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setCurrentStep('payment')}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Retry Payment
              </button>

              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-xl"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
