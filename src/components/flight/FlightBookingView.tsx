import React, { useState, useEffect } from 'react';
import {
  Plane,
  Filter,
  Luggage,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeftRight,
  Sparkles,
  Users,
  Search,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import { Flight } from '../../types';
import { AirportSearchInput } from './AirportSearchInput';
import { generateFlightOffers } from '../../data/flightGenerator';
import { Airport, getAirportByCode } from '../../data/airportsData';

interface FlightBookingViewProps {
  flights: Flight[];
  onBookFlight: (flight: Flight, selectedSeat: string) => void;
  onToggleWishlist: (item: any) => void;
  isWishlisted: (id: string) => boolean;
}

export const FlightBookingView: React.FC<FlightBookingViewProps> = ({
  flights: initialFlights,
  onBookFlight,
}) => {
  const [fromCity, setFromCity] = useState('New York (JFK)');
  const [fromAirport, setFromAirport] = useState<Airport | undefined>(getAirportByCode('JFK'));

  const [toCity, setToCity] = useState('Dubai (DXB)');
  const [toAirport, setToAirport] = useState<Airport | undefined>(getAirportByCode('DXB'));

  const [departureDate, setDepartureDate] = useState('2026-08-15');
  const [cabinClass, setCabinClass] = useState<'All' | 'Economy' | 'Premium Economy' | 'Business' | 'First Class'>('All');
  const [nonStopOnly, setNonStopOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  
  const [currentFlights, setCurrentFlights] = useState<Flight[]>(initialFlights);
  const [selectedFlightForSeats, setSelectedFlightForSeats] = useState<Flight | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string>('14A');

  // Utility to extract IATA code from string like "New York (JFK)" or "JFK"
  const extractIataCode = (str: string, fallbackCode: string): string => {
    const match = str.match(/\(([A-Z]{3})\)/);
    if (match) return match[1];
    if (str.trim().length === 3) return str.trim().toUpperCase();
    return fallbackCode;
  };

  // Generate or update flights whenever key search criteria change
  const triggerSearch = () => {
    const fromCode = fromAirport ? fromAirport.code : extractIataCode(fromCity, 'JFK');
    const toCode = toAirport ? toAirport.code : extractIataCode(toCity, 'DXB');

    const generated = generateFlightOffers(fromCode, toCode, departureDate, cabinClass);
    if (generated.length > 0) {
      setCurrentFlights(generated);
    } else {
      setCurrentFlights(initialFlights);
    }
  };

  // Re-run search when origin, destination or cabin class changes
  useEffect(() => {
    triggerSearch();
  }, [fromCity, toCity, cabinClass, departureDate]);

  const handleSwapAirports = () => {
    const tempCity = fromCity;
    const tempAirport = fromAirport;

    setFromCity(toCity);
    setFromAirport(toAirport);

    setToCity(tempCity);
    setToAirport(tempAirport);
  };

  // Handle airline selection filters
  const toggleAirlineFilter = (airline: string) => {
    if (selectedAirlines.includes(airline)) {
      setSelectedAirlines(selectedAirlines.filter((a) => a !== airline));
    } else {
      setSelectedAirlines([...selectedAirlines, airline]);
    }
  };

  const availableAirlines: string[] = Array.from(new Set(currentFlights.map((f) => f.airline)));

  const filteredFlights = currentFlights.filter((f) => {
    const matchesCabin = cabinClass === 'All' || f.cabinClass === cabinClass;
    const matchesStops = !nonStopOnly || f.stops === 0;
    const matchesPrice = f.price <= maxPrice;
    const matchesAirline =
      selectedAirlines.length === 0 || selectedAirlines.includes(f.airline);
    return matchesCabin && matchesStops && matchesPrice && matchesAirline;
  });

  const seatRows = [10, 11, 12, 14, 15, 16, 17, 18];
  const occupiedSeats = ['10B', '10C', '12A', '14F', '15C', '17D'];

  return (
    <div id="flight-booking-module" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Search Header Panel with Auto-Complete */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/90 -mt-12 relative z-20 mb-8 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-end gap-4">
          {/* From Input */}
          <div className="w-full lg:w-1/3">
            <AirportSearchInput
              label="From (Origin)"
              value={fromCity}
              onChange={(formatted, airportObj) => {
                setFromCity(formatted);
                setFromAirport(airportObj);
              }}
              placeholder="Origin City, Airport, or IATA Code..."
              iconType="origin"
            />
          </div>

          {/* Swap Button */}
          <div className="self-center lg:self-end pb-1">
            <button
              type="button"
              onClick={handleSwapAirports}
              title="Swap Origin and Destination"
              className="p-2.5 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 transition-transform hover:rotate-180 duration-300 shadow-xs cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* To Input */}
          <div className="w-full lg:w-1/3">
            <AirportSearchInput
              label="To (Destination)"
              value={toCity}
              onChange={(formatted, airportObj) => {
                setToCity(formatted);
                setToAirport(airportObj);
              }}
              placeholder="Destination City, Airport, or IATA Code..."
              iconType="destination"
            />
          </div>

          {/* Date Picker */}
          <div className="w-full lg:w-1/5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Departure Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-orange-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Cabin Class */}
          <div className="w-full lg:w-1/5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Cabin Class
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-orange-500 absolute left-3 top-3 pointer-events-none" />
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value as any)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="All">All Cabin Classes</option>
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business</option>
                <option value="First Class">First Class</option>
              </select>
            </div>
          </div>

          {/* Search Button Trigger */}
          <div className="w-full lg:w-auto">
            <button
              type="button"
              onClick={triggerSearch}
              className="w-full lg:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search Flights</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div id="flight-filters-sidebar" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-500" /> Filter Flights
            </h3>
            <span
              className="text-xs font-semibold text-orange-600 cursor-pointer flex items-center gap-1 hover:underline"
              onClick={() => {
                setCabinClass('All');
                setNonStopOnly(false);
                setMaxPrice(2500);
                setSelectedAirlines([]);
              }}
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </span>
          </div>

          {/* Stops Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Stops</label>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={nonStopOnly}
                onChange={(e) => setNonStopOnly(e.target.checked)}
                className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              Non-stop Only
            </label>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
              <span>Max Price</span>
              <span className="text-orange-600 font-extrabold">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="4000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Airline Badges Filter */}
          {availableAirlines.length > 0 && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Airlines</label>
              <div className="space-y-2 text-xs text-slate-600 max-h-48 overflow-y-auto pr-1">
                {availableAirlines.map((airline) => (
                  <label key={airline} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedAirlines.length === 0 || selectedAirlines.includes(airline)}
                      onChange={() => toggleAirlineFilter(airline)}
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span className="truncate">{airline}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Flight Cards List */}
        <div id="flight-results-container" className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center pb-2">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Showing <span className="text-orange-600 font-extrabold">{filteredFlights.length}</span> Verified Flight Offers
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Sort by:</span>
              <select className="bg-white border border-slate-200 rounded-lg text-xs font-semibold px-2 py-1 text-slate-800">
                <option>Price (Low to High)</option>
                <option>Duration (Shortest First)</option>
                <option>Departure Time</option>
              </select>
            </div>
          </div>

          {filteredFlights.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Plane className="w-12 h-12 text-slate-300 mx-auto transform -rotate-45" />
              <h3 className="text-base font-extrabold text-slate-800">No matching flights found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try widening your search filters, adjusting max price, or picking a different cabin class.
              </p>
            </div>
          ) : (
            filteredFlights.map((flight) => (
              <div
                key={flight.id}
                id={`flight-card-${flight.id}`}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group"
              >
                {/* Left Details */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <img src={flight.logo} alt={flight.airline} className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200" />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{flight.airline}</h4>
                      <p className="text-xs text-slate-500 font-mono">{flight.flightNumber} • {flight.cabinClass}</p>
                    </div>
                    {flight.refundable && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        Refundable
                      </span>
                    )}
                  </div>

                  {/* Flight Times & Duration */}
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xl font-extrabold text-slate-900">{flight.departureTime}</p>
                      <p className="text-xs font-bold text-slate-600">{flight.fromCode}</p>
                      <p className="text-[11px] text-slate-500">{flight.fromCity}</p>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-[11px] font-semibold text-slate-500">{flight.duration}</span>
                      <div className="w-full flex items-center gap-1 my-1">
                        <div className="h-0.5 flex-1 bg-slate-200"></div>
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <div className="h-0.5 flex-1 bg-slate-200"></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase">
                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
                      </span>
                    </div>

                    <div>
                      <p className="text-xl font-extrabold text-slate-900">{flight.arrivalTime}</p>
                      <p className="text-xs font-bold text-slate-600">{flight.toCode}</p>
                      <p className="text-[11px] text-slate-500">{flight.toCity}</p>
                    </div>
                  </div>

                  {/* Baggage & Amenities Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                      <Luggage className="w-3 h-3 text-slate-500" /> {flight.baggageAllowance}
                    </span>
                    {flight.amenities.map((am) => (
                      <span key={am} className="text-[10px] text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Price & Booking Trigger */}
                <div className="md:border-l md:border-slate-100 md:pl-6 flex md:flex-col justify-between items-end gap-3 shrink-0">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase text-right">Per Passenger</p>
                    <p className="text-2xl font-extrabold text-orange-600">${flight.price}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold text-right">Includes taxes &amp; fees</p>
                  </div>

                  <button
                    id={`btn-select-flight-${flight.id}`}
                    onClick={() => setSelectedFlightForSeats(flight)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Select &amp; Choose Seat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Seat Map Selector Modal */}
      {selectedFlightForSeats && (
        <div id="seat-selection-modal" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Choose Your Flight Seat</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedFlightForSeats.airline} {selectedFlightForSeats.flightNumber} • {selectedFlightForSeats.fromCode} ➔ {selectedFlightForSeats.toCode}</p>
              </div>
              <button
                onClick={() => setSelectedFlightForSeats(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Seat Map Legend */}
            <div className="flex justify-center items-center gap-6 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-200"></span> Occupied</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border-2 border-orange-500"></span> Available</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-500"></span> Selected ({selectedSeat})</span>
            </div>

            {/* Interactive Seat Grid */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase text-center tracking-widest">FRONT OF AIRCRAFT</p>

              <div className="space-y-2">
                {seatRows.map((row) => (
                  <div key={row} className="flex justify-center items-center gap-2">
                    <span className="w-5 text-center text-xs font-bold text-slate-400">{row}</span>
                    {['A', 'B', 'C'].map((col) => {
                      const seatId = `${row}${col}`;
                      const isOccupied = occupiedSeats.includes(seatId);
                      const isSelected = selectedSeat === seatId;
                      return (
                        <button
                          key={seatId}
                          disabled={isOccupied}
                          onClick={() => setSelectedSeat(seatId)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isOccupied
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : isSelected
                              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-400'
                              : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-orange-400'
                          }`}
                        >
                          {col}
                        </button>
                      );
                    })}
                    <div className="w-6 text-center text-[10px] text-slate-300 font-bold">AISLE</div>
                    {['D', 'E', 'F'].map((col) => {
                      const seatId = `${row}${col}`;
                      const isOccupied = occupiedSeats.includes(seatId);
                      const isSelected = selectedSeat === seatId;
                      return (
                        <button
                          key={seatId}
                          disabled={isOccupied}
                          onClick={() => setSelectedSeat(seatId)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isOccupied
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : isSelected
                              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-400'
                              : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-orange-400'
                          }`}
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-xs text-slate-500 font-medium">Selected Seat</p>
                <p className="text-sm font-extrabold text-orange-600">{selectedSeat} (Window / Extra Comfort)</p>
              </div>

              <button
                id="btn-confirm-flight-seat"
                onClick={() => {
                  if (selectedFlightForSeats) {
                    onBookFlight(selectedFlightForSeats, selectedSeat);
                  }
                  setSelectedFlightForSeats(null);
                }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-orange-500/30 hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

