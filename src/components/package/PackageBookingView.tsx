import React, { useState } from 'react';
import { Palmtree, Star, Clock, Check, ChevronDown, ChevronUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { HolidayPackage } from '../../types';

interface PackageBookingViewProps {
  packages: HolidayPackage[];
  onBookPackage: (pkg: HolidayPackage) => void;
}

export const PackageBookingView: React.FC<PackageBookingViewProps> = ({
  packages,
  onBookPackage,
}) => {
  const [expandedPkgId, setExpandedPkgId] = useState<string | null>('pkg_401');

  return (
    <div id="package-module" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="mb-2">
        <h2 className="text-xl font-extrabold text-slate-900">Curated All-Inclusive Holiday Packages</h2>
        <p className="text-xs text-slate-500">Handcrafted travel itineraries with 4-5★ hotels, transfers, sightseeing &amp; meals included</p>
      </div>

      <div className="space-y-6">
        {packages.map((pkg) => {
          const isExpanded = expandedPkgId === pkg.id;
          return (
            <div key={pkg.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 flex flex-col lg:flex-row gap-6">
                <div className="lg:w-80 h-56 lg:h-auto rounded-2xl overflow-hidden shrink-0 relative">
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-300" /> {pkg.rating} ({pkg.reviews} reviews)
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {pkg.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-extrabold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900">{pkg.title}</h3>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-orange-500" /> {pkg.durationDays} Days / {pkg.durationNights} Nights</span>
                    <span>•</span>
                    <span>Destination: <strong>{pkg.destination}, {pkg.country}</strong></span>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {pkg.inclusions.slice(0, 4).map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                        <span className="truncate">{inc}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 line-through mr-2">${pkg.originalPrice}</span>
                      <span className="text-2xl font-extrabold text-orange-600">${pkg.price}</span>
                      <span className="text-xs text-slate-500 font-medium"> / person</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setExpandedPkgId(isExpanded ? null : pkg.id)}
                        className="text-xs font-bold text-slate-700 hover:text-orange-600 flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Hide Itinerary' : 'View Day-by-Day Itinerary'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => onBookPackage(pkg)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all"
                      >
                        <span>Book Package</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day by Day Itinerary Accordion Expansion */}
              {isExpanded && (
                <div className="bg-slate-50 border-t border-slate-200 p-6 space-y-4">
                  <h4 className="font-extrabold text-slate-900 text-sm">Detailed Day-by-Day Tour Itinerary</h4>
                  <div className="space-y-3">
                    {pkg.itinerary.map((dayItem) => (
                      <div key={dayItem.day} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md">
                            DAY {dayItem.day}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">Stay: {dayItem.hotel}</span>
                        </div>
                        <h5 className="font-bold text-slate-800 text-xs">{dayItem.title}</h5>
                        <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                          {dayItem.activities.map((act, idx) => (
                            <li key={idx}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
