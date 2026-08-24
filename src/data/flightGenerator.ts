import { Flight } from '../types';
import { Airport, getAirportByCode, ALL_AIRPORTS } from './airportsData';

export interface AirlineInfo {
  name: string;
  code: string;
  logo: string;
  hubs: string[]; // IATA codes of main hubs
}

export const MAJOR_AIRLINES: AirlineInfo[] = [
  {
    name: 'Emirates',
    code: 'EK',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=120',
    hubs: ['DXB'],
  },
  {
    name: 'Singapore Airlines',
    code: 'SQ',
    logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=120',
    hubs: ['SIN'],
  },
  {
    name: 'British Airways',
    code: 'BA',
    logo: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=120',
    hubs: ['LHR', 'LGW'],
  },
  {
    name: 'Qatar Airways',
    code: 'QR',
    logo: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&q=80&w=120',
    hubs: ['DOH'],
  },
  {
    name: 'Delta Air Lines',
    code: 'DL',
    logo: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&q=80&w=120',
    hubs: ['ATL', 'JFK', 'LAX', 'SEA', 'DTW'],
  },
  {
    name: 'United Airlines',
    code: 'UA',
    logo: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=120',
    hubs: ['ORD', 'EWR', 'SFO', 'IAH', 'DEN'],
  },
  {
    name: 'American Airlines',
    code: 'AA',
    logo: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=120',
    hubs: ['DFW', 'MIA', 'CLT', 'ORD', 'PHL'],
  },
  {
    name: 'Lufthansa',
    code: 'LH',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=120',
    hubs: ['FRA', 'MUC'],
  },
  {
    name: 'Air France',
    code: 'AF',
    logo: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=120',
    hubs: ['CDG', 'ORY'],
  },
  {
    name: 'KLM Royal Dutch',
    code: 'KL',
    logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=120',
    hubs: ['AMS'],
  },
  {
    name: 'Qantas Airways',
    code: 'QF',
    logo: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&q=80&w=120',
    hubs: ['SYD', 'MEL', 'BNE', 'PER'],
  },
  {
    name: 'IndiGo',
    code: '6E',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=120',
    hubs: ['DEL', 'BOM', 'BLR', 'CCU'],
  },
  {
    name: 'Air India',
    code: 'AI',
    logo: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&q=80&w=120',
    hubs: ['DEL', 'BOM'],
  },
  {
    name: 'Cathay Pacific',
    code: 'CX',
    logo: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=120',
    hubs: ['HKG'],
  },
  {
    name: 'ANA (All Nippon)',
    code: 'NH',
    logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=120',
    hubs: ['HND', 'NRT'],
  },
  {
    name: 'Japan Airlines',
    code: 'JL',
    logo: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&q=80&w=120',
    hubs: ['HND', 'NRT'],
  },
  {
    name: 'Etihad Airways',
    code: 'EY',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=120',
    hubs: ['AUH'],
  },
  {
    name: 'Turkish Airlines',
    code: 'TK',
    logo: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&q=80&w=120',
    hubs: ['IST'],
  },
  {
    name: 'Virgin Atlantic',
    code: 'VS',
    logo: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=120',
    hubs: ['LHR', 'MAN'],
  },
  {
    name: 'Korean Air',
    code: 'KE',
    logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=120',
    hubs: ['ICN'],
  },
];

/**
 * Calculate approximate flight distance in km using Haversine formula
 */
function calculateDistanceKm(from: Airport, to: Airport): number {
  if (from.latitude && from.longitude && to.latitude && to.longitude) {
    const R = 6371; // Earth's radius in km
    const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
    const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((from.latitude * Math.PI) / 180) *
        Math.cos((to.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  // Fallback distance based on region comparison
  if (from.country === to.country) return 900; // Domestic
  if (from.region === to.region) return 1800; // Regional
  return 7500; // Long-haul intercontinental
}

/**
 * Format minutes into readable flight duration "14h 25m"
 */
function formatDuration(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins < 10 ? '0' : ''}${mins}m`;
}

/**
 * Add flight minutes to departure time "14:30" to get arrival time "06:15 (+1 day)"
 */
function calculateArrivalTime(depTimeStr: string, flightMinutes: number): string {
  const [hStr, mStr] = depTimeStr.split(':');
  let totalMins = parseInt(hStr, 10) * 60 + parseInt(mStr, 10) + flightMinutes;

  const daysAdded = Math.floor(totalMins / (24 * 60));
  totalMins = totalMins % (24 * 60);

  const arrHours = Math.floor(totalMins / 60);
  const arrMins = totalMins % 60;

  const timePart = `${arrHours < 10 ? '0' : ''}${arrHours}:${arrMins < 10 ? '0' : ''}${arrMins}`;

  if (daysAdded === 0) return timePart;
  if (daysAdded === 1) return `${timePart} (+1 day)`;
  return `${timePart} (+${daysAdded} days)`;
}

/**
 * Dynamically generate realistic matching flight offers for ANY Origin and Destination airport pair.
 */
export function generateFlightOffers(
  fromCode: string,
  toCode: string,
  travelDate?: string,
  preferredCabin: 'All' | 'Economy' | 'Premium Economy' | 'Business' | 'First Class' = 'All'
): Flight[] {
  const fromAirport = getAirportByCode(fromCode) || {
    code: fromCode.toUpperCase(),
    name: `${fromCode.toUpperCase()} Airport`,
    city: fromCode,
    country: 'International',
    region: 'Asia',
  };

  const toAirport = getAirportByCode(toCode) || {
    code: toCode.toUpperCase(),
    name: `${toCode.toUpperCase()} Airport`,
    city: toCode,
    country: 'International',
    region: 'Europe',
  };

  // If same airport, return empty list
  if (fromAirport.code === toAirport.code) {
    return [];
  }

  const distanceKm = calculateDistanceKm(fromAirport, toAirport);
  
  // Base duration in minutes (cruising speed ~820 km/h + taxi/takeoff/landing)
  const baseFlightMins = Math.max(50, Math.round((distanceKm / 820) * 60 + 45));

  // Determine potential airlines suitable for this route
  let suitableAirlines = MAJOR_AIRLINES.filter(
    (a) => a.hubs.includes(fromAirport.code) || a.hubs.includes(toAirport.code)
  );

  if (suitableAirlines.length < 3) {
    // Add regional or global airlines
    suitableAirlines = [...suitableAirlines, ...MAJOR_AIRLINES.slice(0, 6)];
  }

  // Deduplicate airlines
  const uniqueAirlines = Array.from(new Set(suitableAirlines.map((a) => a.code)))
    .map((code) => MAJOR_AIRLINES.find((a) => a.code === code)!)
    .filter(Boolean);

  const departures = [
    '06:15', '08:40', '11:20', '14:05', '17:30', '20:45', '22:50', '23:55'
  ];

  const cabinClasses: ('Economy' | 'Premium Economy' | 'Business' | 'First Class')[] =
    preferredCabin === 'All'
      ? ['Economy', 'Economy', 'Premium Economy', 'Business', 'Economy', 'Business', 'Economy']
      : [preferredCabin];

  const flights: Flight[] = [];

  // Generate 6 to 10 realistic flight schedules
  const count = Math.min(uniqueAirlines.length * 2, 8);

  for (let i = 0; i < count; i++) {
    const airline = uniqueAirlines[i % uniqueAirlines.length];
    const depTime = departures[i % departures.length];
    
    // Determine stops (0 stops for direct, 1 stop if distance > 1500km)
    const isDirect = i % 2 === 0 || distanceKm < 1800;
    const stops = isDirect ? 0 : 1;
    const durationMins = isDirect ? baseFlightMins : baseFlightMins + 130 + (i % 3) * 20;

    const arrTime = calculateArrivalTime(depTime, durationMins);
    const durationStr = formatDuration(durationMins);

    const cabin = cabinClasses[i % cabinClasses.length];

    // Realistic pricing calculation based on distance and cabin class
    let basePrice = Math.round(45 + distanceKm * 0.082);
    if (!isDirect) basePrice = Math.round(basePrice * 0.88); // Connecting flight discount

    let finalPrice = basePrice;
    if (cabin === 'Premium Economy') finalPrice = Math.round(basePrice * 1.55);
    if (cabin === 'Business') finalPrice = Math.round(basePrice * 3.2);
    if (cabin === 'First Class') finalPrice = Math.round(basePrice * 5.8);

    // Randomize slightly (+/- 10%)
    const variance = (i * 17) % 25 - 12;
    finalPrice = Math.max(65, finalPrice + variance);

    // Flight number (e.g. EK-204)
    const numPart = 100 + ((i * 37 + distanceKm) % 899);
    const flightNumber = `${airline.code}-${numPart}`;

    // Baggage & Amenities
    let baggageAllowance = '23 kg Check-in + 7 kg Cabin';
    if (cabin === 'Premium Economy') baggageAllowance = '30 kg Check-in + 10 kg Cabin';
    if (cabin === 'Business') baggageAllowance = '2x 32 kg Check-in + 12 kg Cabin';
    if (cabin === 'First Class') baggageAllowance = '3x 32 kg Check-in + 15 kg Cabin';

    const amenitiesMap = [
      ['In-flight Wi-Fi', 'Hot Gourmet Meal', 'USB Power', 'HD Entertainment Screen'],
      ['Extra Legroom', 'Noise-Cancelling Headphones', 'Complimentary Wine & Spirits', 'Wi-Fi'],
      ['Lie-flat Seat Bed', 'Priority Check-in & Lounge Access', 'Gourmet Multi-Course Dining', 'USB-C Fast Charging'],
      ['Private Suite', 'Chauffeur-drive Service', 'First Class Lounge Access', 'Unlimited High-Speed Wi-Fi'],
    ];

    const amenityIdx = cabin === 'First Class' ? 3 : cabin === 'Business' ? 2 : cabin === 'Premium Economy' ? 1 : 0;

    flights.push({
      id: `fl_gen_${fromAirport.code.toLowerCase()}_${toAirport.code.toLowerCase()}_${i + 1}`,
      flightNumber,
      airline: airline.name,
      logo: airline.logo,
      fromCity: `${fromAirport.city} (${fromAirport.code})`,
      fromCode: fromAirport.code,
      toCity: `${toAirport.city} (${toAirport.code})`,
      toCode: toAirport.code,
      departureTime: depTime,
      arrivalTime: arrTime,
      duration: durationStr,
      stops,
      price: finalPrice,
      cabinClass: cabin,
      seatsAvailable: 3 + ((i * 11) % 18),
      baggageAllowance,
      refundable: cabin === 'Business' || cabin === 'First Class' || i % 2 === 0,
      amenities: amenitiesMap[amenityIdx],
    });
  }

  // Sort by price ascending initially
  return flights.sort((a, b) => a.price - b.price);
}
