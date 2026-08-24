import React, { useState } from 'react';
import { Bus, Star, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Bus as BusType } from '../../types';

interface BusBookingViewProps {
  buses: BusType[];
  onBookBus: (bus: BusType, selectedSeat: string) => void;
}

export const BusBookingView: React.FC<BusBookingViewProps> = ({ buses, onBookBus }) => {
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string>('L-04');

  return (
    <div id="bus-booking-module" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Intercity Bus Tickets</h2>
        <p className="text-xs text-slate-500">Premium AC Volvo, Sleeper &amp; Multi-Axle buses with live GPS tracking &amp; M-ticket</p>
      </div>

      <div className="space-y-4">
        {buses.map((bus) => (
          <div key={bus.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Bus className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{bus.busOperator}</h3>
                  <p className="text-xs text-slate-500">{bus.busType}</p>
                </div>
                <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> {bus.rating}
                </span>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-700 font-semibold pt-1">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{bus.departureTime}</p>
                  <p className="text-slate-500 font-normal">{bus.fromCity}</p>
                </div>
                <div className="text-center text-[10px] text-slate-400">
                  <span>{bus.duration}</span>
                  <div className="w-16 h-0.5 bg-slate-200 my-1"></div>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{bus.arrivalTime}</p>
                  <p className="text-slate-500 font-normal">{bus.toCity}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:flex-col md:items-end gap-3 border-t md:border-t-0 pt-3 md:pt-0">
              <div>
                <p className="text-xs text-slate-400">Starting from</p>
                <p className="text-2xl font-extrabold text-orange-600">${bus.price}</p>
              </div>

              <button
                onClick={() => setSelectedBus(bus)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span>Select Seats</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bus Seat Layout Selection Modal */}
      {selectedBus && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900">{selectedBus.busOperator}</h3>
                <p className="text-xs text-slate-500">{selectedBus.fromCity} ➔ {selectedBus.toCity}</p>
              </div>
              <button onClick={() => setSelectedBus(null)} className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-500">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
              <p className="text-xs font-bold text-slate-500 text-center">LOWER DECK SLEEPER BERTHS</p>
              <div className="grid grid-cols-4 gap-2">
                {['L-01', 'L-02', 'L-03', 'L-04', 'L-05', 'L-06', 'L-07', 'L-08'].map((seat) => (
                  <button
                    key={seat}
                    onClick={() => setSelectedSeat(seat)}
                    className={`py-2 text-xs font-bold rounded-xl border ${
                      selectedSeat === seat
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-orange-400'
                    }`}
                  >
                    {seat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="text-xs text-slate-400">Selected Seat</p>
                <p className="text-sm font-extrabold text-orange-600">{selectedSeat}</p>
              </div>
              <button
                onClick={() => {
                  onBookBus(selectedBus, selectedSeat);
                  setSelectedBus(null);
                }}
                className="bg-orange-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
              >
                Confirm &amp; Pay ${selectedBus.price}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
