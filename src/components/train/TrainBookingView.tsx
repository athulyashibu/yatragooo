import React, { useState } from 'react';
import { TrainTrack, Search, Clock, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';
import { Train } from '../../types';

interface TrainBookingViewProps {
  trains: Train[];
  onBookTrain: (train: Train, selectedClass: any) => void;
}

export const TrainBookingView: React.FC<TrainBookingViewProps> = ({ trains, onBookTrain }) => {
  const [pnrInput, setPnrInput] = useState('');
  const [pnrResult, setPnrResult] = useState<any>(null);
  const [quota, setQuota] = useState<'General' | 'Tatkal' | 'Senior Citizen'>('General');

  const handleCheckPnr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrInput) return;
    setPnrResult({
      pnr: pnrInput,
      trainName: 'New Delhi - Mumbai Central Tejas Rajdhani (12952)',
      bookingStatus: 'CNF (Confirmed)',
      coach: 'B4',
      berth: '32 (Side Lower)',
      chartPrepared: true,
      departureTime: '16:55 Today',
    });
  };

  return (
    <div id="train-booking-module" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top PNR & Live Running Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PNR Checker Box */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <TrainTrack className="w-5 h-5 text-orange-500" />
            <h3 className="font-extrabold text-slate-900 text-sm">Check PNR Live Status</h3>
          </div>
          <form onSubmit={handleCheckPnr} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter 10-digit PNR number"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button type="submit" className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl">
              Get Status
            </button>
          </form>

          {pnrResult && (
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-xs space-y-1.5 animate-in fade-in">
              <div className="flex justify-between font-bold text-emerald-800">
                <span>PNR: {pnrResult.pnr}</span>
                <span>{pnrResult.bookingStatus}</span>
              </div>
              <p className="text-slate-700 font-medium">{pnrResult.trainName}</p>
              <div className="flex gap-4 text-[11px] text-slate-600 font-semibold pt-1">
                <span>Coach: <strong>{pnrResult.coach}</strong></span>
                <span>Berth: <strong>{pnrResult.berth}</strong></span>
                <span>Chart: <strong className="text-emerald-600">Prepared</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Quota Selector */}
        <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-md">
              IRCTC Authorised Partner
            </span>
            <h3 className="text-base font-extrabold mt-2">IRCTC Railway Booking Engine</h3>
            <p className="text-xs text-slate-300">Instant confirmation with free cancellation option</p>
          </div>

          <div className="flex gap-2">
            {(['General', 'Tatkal', 'Senior Citizen'] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQuota(q)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  quota === q ? 'bg-orange-500 border-orange-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {q} Quota
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Train List */}
      <div className="space-y-4">
        {trains.map((tr) => (
          <div key={tr.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-orange-600">#{tr.trainNumber}</span>
                <h3 className="font-extrabold text-slate-900 text-base">{tr.trainName}</h3>
                <p className="text-xs text-slate-500">Runs on: {tr.runsOn.join(', ')}</p>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-700 font-semibold">
                <div>
                  <p className="text-base font-extrabold text-slate-900">{tr.departureTime}</p>
                  <p className="text-slate-500 font-medium">{tr.fromStation} ({tr.fromCode})</p>
                </div>
                <div className="text-center text-[10px] text-slate-400">
                  <span>{tr.duration}</span>
                  <div className="w-16 h-0.5 bg-slate-200 my-1"></div>
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-900">{tr.arrivalTime}</p>
                  <p className="text-slate-500 font-medium">{tr.toStation} ({tr.toCode})</p>
                </div>
              </div>
            </div>

            {/* Travel Classes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {tr.classes.map((cls) => (
                <div key={cls.code} className="border border-slate-200 rounded-2xl p-3 bg-slate-50/50 space-y-2 hover:border-orange-300 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-xs">{cls.code} - {cls.name}</span>
                    <span className="text-sm font-extrabold text-orange-600">${cls.price}</span>
                  </div>
                  <p className="text-[10px] font-extrabold text-emerald-600">{cls.availability}</p>
                  <button
                    onClick={() => onBookTrain(tr, cls)}
                    className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold text-[11px] py-1.5 rounded-xl transition-all"
                  >
                    Book Seat
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
