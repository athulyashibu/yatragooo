import React from 'react';
import { Car, Star, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { Cab } from '../../types';

interface CabBookingViewProps {
  cabs: Cab[];
  onBookCab: (cab: Cab) => void;
}

export const CabBookingView: React.FC<CabBookingViewProps> = ({ cabs, onBookCab }) => {
  return (
    <div id="cab-booking-module" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Airport Cabs &amp; Outstation Car Rentals</h2>
        <p className="text-xs text-slate-500">Fixed fares, verified background-checked drivers, clean sanitized vehicles with zero cancellation charges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cabs.map((cab) => (
          <div key={cab.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="flex gap-4">
              <img src={cab.image} alt={cab.vehicleName} className="w-28 h-24 object-cover rounded-2xl border border-slate-100" />
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-orange-600 uppercase bg-orange-50 px-2 py-0.5 rounded-md">
                  {cab.vehicleType}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">{cab.vehicleName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Driver: {cab.driverName}
                </p>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 pt-1">
                  <span>Capacity: <strong>{cab.capacity} Passengers</strong></span>
                  <span>Luggage: <strong>{cab.luggageCapacity} Bags</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {cab.features.map((feat) => (
                <span key={feat} className="text-[10px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  ✓ {feat}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <span className="text-2xl font-extrabold text-orange-600">${cab.estimatedPrice}</span>
                <span className="text-xs text-slate-500"> (Fixed Guaranteed Fare)</span>
              </div>
              <button
                onClick={() => onBookCab(cab)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span>Book Cab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
