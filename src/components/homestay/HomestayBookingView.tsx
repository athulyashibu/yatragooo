import React from 'react';
import { Home, Star, MapPin, Users, Bed, Bath, ArrowRight } from 'lucide-react';
import { Homestay } from '../../types';

interface HomestayBookingViewProps {
  homestays: Homestay[];
  onBookHomestay: (homestay: Homestay) => void;
}

export const HomestayBookingView: React.FC<HomestayBookingViewProps> = ({
  homestays,
  onBookHomestay,
}) => {
  return (
    <div id="homestay-module" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-slate-900">Featured Homestays &amp; Vacation Villas</h2>
        <p className="text-xs text-slate-500">Entire homes, private chalets, and eco-lodges with superhosts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homestays.map((hs) => (
          <div key={hs.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
            <div>
              <div className="h-52 relative overflow-hidden">
                <img src={hs.image} alt={hs.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300" /> {hs.rating} ({hs.reviews})
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <img src={hs.hostAvatar} alt={hs.hostName} className="w-7 h-7 rounded-full object-cover ring-2 ring-orange-400" />
                  <span className="text-xs font-bold text-slate-700">Hosted by {hs.hostName}</span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm line-clamp-2">{hs.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {hs.location}
                </p>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-orange-500" /> {hs.bedrooms} Beds</span>
                  <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-orange-500" /> {hs.bathrooms} Baths</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-orange-500" /> Max {hs.maxGuests}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
              <div>
                <span className="text-xl font-extrabold text-orange-600">${hs.pricePerNight}</span>
                <span className="text-xs text-slate-500 font-medium"> / night</span>
              </div>
              <button
                onClick={() => onBookHomestay(hs)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span>Book Stay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
