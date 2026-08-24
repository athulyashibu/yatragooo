import React, { useState } from 'react';
import {
  Building,
  Star,
  MapPin,
  Check,
  Filter,
  ArrowRight,
  Wifi,
  Waves,
  Coffee,
  Sparkles,
  Search,
} from 'lucide-react';
import { Hotel } from '../../types';

interface HotelBookingViewProps {
  hotels: Hotel[];
  onBookHotel: (hotel: Hotel, selectedRoom: any) => void;
}

export const HotelBookingView: React.FC<HotelBookingViewProps> = ({
  hotels,
  onBookHotel,
}) => {
  const [citySearch, setCitySearch] = useState('');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('All');
  const [selectedHotelForRoom, setSelectedHotelForRoom] = useState<Hotel | null>(null);

  const filteredHotels = hotels.filter((h) => {
    const matchesCity = !citySearch || h.city.toLowerCase().includes(citySearch.toLowerCase()) || h.location.toLowerCase().includes(citySearch.toLowerCase());
    const matchesRating = selectedRating === 0 || h.rating >= selectedRating;
    const matchesType = selectedPropertyType === 'All' || h.propertyType === selectedPropertyType;
    return matchesCity && matchesRating && matchesType;
  });

  return (
    <div id="hotel-booking-module" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Search Header Banner */}
      <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200/80 -mt-12 relative z-20 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Destination or Hotel Name</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-orange-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. Bali, Paris, Dubai, Ritz-Carlton"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Check-in / Check-out</label>
            <input
              type="text"
              defaultValue="Aug 16 - Aug 20 (4 Nights)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Guests &amp; Rooms</label>
            <input
              type="text"
              defaultValue="2 Adults • 1 Room"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-500" /> Filter Hotels
            </h3>
            <span className="text-xs font-semibold text-orange-600 cursor-pointer" onClick={() => { setCitySearch(''); setSelectedRating(0); setSelectedPropertyType('All'); }}>
              Reset
            </span>
          </div>

          {/* Star Rating Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Guest Rating</label>
            <div className="space-y-2 text-xs font-medium text-slate-600">
              {[4.8, 4.5, 4.0].map((rating) => (
                <label key={rating} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === rating}
                    onChange={() => setSelectedRating(rating)}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {rating}+ Excellent
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Property Type</label>
            <div className="space-y-2 text-xs text-slate-600">
              {['All', 'Resort', 'Boutique', 'Luxury Spa'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={selectedPropertyType === type}
                    onChange={() => setSelectedPropertyType(type)}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Hotel Cards Grid */}
        <div className="lg:col-span-3 space-y-6">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              id={`hotel-card-${hotel.id}`}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col md:flex-row"
            >
              <div className="md:w-72 h-56 md:h-auto relative overflow-hidden shrink-0">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300" /> {hotel.rating}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                        {hotel.propertyType}
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 mt-1">{hotel.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {hotel.location}
                      </p>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {hotel.amenities.map((am) => (
                      <span key={am} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 line-through mr-2">${hotel.originalPrice}</span>
                    <span className="text-2xl font-extrabold text-orange-600">${hotel.pricePerNight}</span>
                    <span className="text-xs text-slate-500 font-medium"> / night</span>
                  </div>

                  <button
                    id={`btn-select-room-${hotel.id}`}
                    onClick={() => setSelectedHotelForRoom(hotel)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <span>View Rooms &amp; Select</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Selection Modal */}
      {selectedHotelForRoom && (
        <div id="room-selection-modal" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedHotelForRoom.name}</h3>
                <p className="text-xs text-slate-500">{selectedHotelForRoom.location}</p>
              </div>
              <button
                onClick={() => setSelectedHotelForRoom(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {selectedHotelForRoom.roomTypes.map((room, idx) => (
                <div key={idx} className="border border-slate-200 rounded-2xl p-4 hover:border-orange-300 transition-colors bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-sm">{room.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{room.bed} • Up to {room.capacity} Guests</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {room.features.map((f) => (
                        <span key={f} className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xl font-extrabold text-orange-600">${room.price} <span className="text-xs text-slate-500 font-normal">/night</span></p>
                    <button
                      onClick={() => {
                        onBookHotel(selectedHotelForRoom, room);
                        setSelectedHotelForRoom(null);
                      }}
                      className="mt-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:scale-102 transition-all"
                    >
                      Reserve Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
