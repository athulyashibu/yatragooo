export type TravelMode =
  | 'flights'
  | 'hotels'
  | 'homestays'
  | 'packages'
  | 'buses'
  | 'trains'
  | 'cabs'
  | 'experiences'
  | 'visa'
  | 'ai-planner'
  | 'community'
  | 'partner'
  | 'dashboard'
  | 'admin'
  | 'architecture';

export type UserRole =
  | 'customer'
  | 'admin'
  | 'partner'
  | 'agency'
  | 'guide'
  | 'support';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  walletBalance: number;
  voyageCoins: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  passportNumber?: string;
  following?: string[];
  savedPosts?: string[];
  address?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  preferredLanguage?: string;
  preferredCurrency?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
}

export interface ComprehensiveUser extends UserProfile {
  accountStatus: 'Active' | 'Suspended' | 'Pending Verification';
  gender: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  dateOfBirth: string;
  address: string;
  country: string;
  registrationDate: string;
  lastLogin: string;
  travelStats: {
    totalBookings: number;
    totalSpending: number;
    wishlistCount: number;
    countriesVisited: number;
    citiesVisited: number;
    totalTrips: number;
    cancelledTrips: number;
    refundRequests: number;
  };
  loginHistory: {
    id: string;
    timestamp: string;
    ipAddress: string;
    device: string;
    location: string;
    status: 'Success' | 'Failed Attempt' | 'Password Reset';
  }[];
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  logo: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First Class';
  seatsAvailable: number;
  baggageAllowance: string;
  refundable: boolean;
  amenities: string[];
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  originalPrice: number;
  image: string;
  images: string[];
  propertyType: 'Hotel' | 'Resort' | 'Boutique' | 'Luxury Spa';
  amenities: string[];
  roomTypes: {
    name: string;
    price: number;
    bed: string;
    capacity: number;
    features: string[];
  }[];
  coordinates: { lat: number; lng: number };
}

export interface Homestay {
  id: string;
  title: string;
  location: string;
  city: string;
  hostName: string;
  hostAvatar: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  image: string;
  amenities: string[];
  houseRules: string[];
}

export interface HolidayPackage {
  id: string;
  title: string;
  destination: string;
  country: string;
  durationDays: number;
  durationNights: number;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  tags: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: {
    day: number;
    title: string;
    activities: string[];
    meals: string;
    hotel: string;
  }[];
}

export interface Bus {
  id: string;
  busOperator: string;
  busType: 'AC Sleeper (2+1)' | 'AC Seater (2+2)' | 'Volvo Multi-Axle' | 'Non-AC Seater';
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  rating: number;
  price: number;
  seatsAvailable: number;
  pickupPoints: string[];
  dropPoints: string[];
}

export interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  fromCode: string;
  toStation: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOn: string[];
  classes: {
    code: '1A' | '2A' | '3A' | 'SL' | 'CC';
    name: string;
    price: number;
    availability: string;
  }[];
}

export interface Cab {
  id: string;
  vehicleName: string;
  vehicleType: 'Hatchback' | 'Sedan' | 'Executive SUV' | 'Electric EV';
  capacity: number;
  luggageCapacity: number;
  pricePerKm: number;
  estimatedPrice: number;
  rating: number;
  features: string[];
  driverName: string;
  image: string;
}

export interface Experience {
  id: string;
  title: string;
  location: string;
  category: 'Adventure' | 'Culinary' | 'Guided Tour' | 'Cultural' | 'Water Sports';
  duration: string;
  rating: number;
  reviewsCount: number;
  pricePerPerson: number;
  image: string;
  highlights: string[];
  includes: string[];
}

export interface Booking {
  id: string;
  pnr: string;
  userId: string; // Linked unique User ID
  bookingDate: string;
  travelDate: string;
  type: 'Flight' | 'Hotel' | 'Homestay' | 'Package' | 'Bus' | 'Train' | 'Cab' | 'Experience';
  title: string;
  subtitle: string;
  amount: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed' | 'Refunded';
  passengerName: string;
  passengerEmail: string;
  details: Record<string, any>;
  qrCodeData: string;
  image?: string;
  destination?: string;
  paymentStatus?: 'Paid' | 'Refunded' | 'Pending' | 'Processing';
}

export interface CommunityStory {
  id: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  destination: string;
  coverImage: string;
  excerpt: string;
  content: string;
  likes: number;
  commentsCount: number;
  date: string;
  tags: string[];
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minAmount: number;
  maxDiscount?: number;
  description: string;
  validTill: string;
}

export interface AITripPlan {
  destination: string;
  durationDays: number;
  totalBudgetEstimate: string;
  bestTimeToVisit: string;
  vibeSummary: string;
  dayByDay: {
    day: number;
    title: string;
    morning: string;
    afternoon: string;
    evening: string;
    estimatedCost: string;
    recommendedStay: string;
  }[];
  mustTryFoods: string[];
  localInsiderTips: string[];
  packingChecklist: string[];
}

export interface AdminMetrics {
  totalRevenue: number;
  totalBookings: number;
  activeUsers: number;
  avgConversionRate: number;
  revenueByCategory: { name: string; value: number }[];
  monthlyRevenue: { month: string; revenue: number; bookings: number }[];
}

export interface NotificationItem {
  id: string;
  type: 'booking' | 'payment' | 'refund' | 'price_drop' | 'promo' | 'loyalty' | 'security';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  iconType?: string;
}

export interface ReviewItem {
  id: string;
  targetId: string;
  targetType: 'hotel' | 'flight' | 'package' | 'homestay' | 'tour_guide' | 'bus';
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  photos?: string[];
  verifiedBooking: boolean;
  helpfulVotes: number;
  reported?: boolean;
}

export interface PartnerListing {
  id: string;
  partnerType: 'hotel' | 'tour_guide' | 'travel_agency' | 'bus_operator';
  title: string;
  location: string;
  price: number;
  status: 'active' | 'pending' | 'paused';
  totalBookings: number;
  rating: number;
  revenue: number;
  availableUnits: number;
  images: string[];
}

export interface PartnerBooking {
  id: string;
  customerName: string;
  serviceTitle: string;
  date: string;
  amount: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'auth' | 'booking' | 'payment' | 'admin' | 'partner';
  ipAddress: string;
  device: string;
  status: 'success' | 'warning' | 'failed';
}

export interface SupportTicket {
  id: string;
  customerName: string;
  email: string;
  subject: string;
  category: 'Booking' | 'Refund' | 'Technical' | 'General';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

