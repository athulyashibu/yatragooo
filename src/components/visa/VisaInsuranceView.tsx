import React, { useState } from 'react';
import { FileCheck2, Shield, Globe2, CheckCircle, Upload, ArrowRight } from 'lucide-react';

export const VisaInsuranceView: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('Schengen (Europe)');
  const [insuranceCoverDays, setInsuranceCoverDays] = useState(7);
  const [insuranceAdded, setInsuranceAdded] = useState(false);

  const countryVisaInfo: Record<string, any> = {
    'Schengen (Europe)': {
      type: 'Embassy Sticker Visa',
      processingTime: '10-15 Working Days',
      fee: '$90 USD',
      documents: ['Valid Passport (6+ months validity)', 'Cover Letter & Flight Reservation', 'Bank Statements (6 months)', 'Travel Medical Insurance (Min €30,000 cover)'],
    },
    'United Arab Emirates (Dubai)': {
      type: 'E-Visa (30 Days Single Entry)',
      processingTime: '24-48 Hours',
      fee: '$65 USD',
      documents: ['Passport Color Copy', 'Passport Photo with White Background', 'Confirmed Flight Return Ticket'],
    },
    'Indonesia (Bali)': {
      type: 'Visa on Arrival (VoA) / E-VoA',
      processingTime: 'Instant on Arrival or 24 Hours Online',
      fee: '$35 USD',
      documents: ['Passport valid for 6 months', 'Return Air Ticket', 'Customs Declaration Form'],
    },
  };

  const currentInfo = countryVisaInfo[selectedCountry] || countryVisaInfo['Schengen (Europe)'];

  return (
    <div id="visa-insurance-module" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Visa Check Tool */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Global Visa Assistance &amp; Eligibility</h2>
            <p className="text-xs text-slate-500">Check visa requirements, e-visa application checklists &amp; document guidelines</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Select Destination Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>Schengen (Europe)</option>
              <option>United Arab Emirates (Dubai)</option>
              <option>Indonesia (Bali)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Visa Type</label>
            <div className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-800">
              {currentInfo.type}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Est. Processing Time</label>
            <div className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-orange-600">
              {currentInfo.processingTime}
            </div>
          </div>
        </div>

        {/* Document Checklist */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Required Document Checklist for {selectedCountry}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentInfo.documents.map((doc: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium bg-white p-2.5 rounded-xl border border-slate-200/60">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Travel Insurance Addon Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">VoyageCare Insurance</span>
          </div>
          <h3 className="text-xl font-extrabold">Comprehensive Travel &amp; Medical Protection</h3>
          <p className="text-xs text-slate-300">
            $100,000 Emergency Medical Cover, Flight Delay Compensation, Lost Baggage Allowance &amp; 24/7 Global SOS Helpline.
          </p>

          <div className="flex items-center gap-4 pt-2 text-xs font-semibold">
            <label className="flex items-center gap-2">
              <span>Duration:</span>
              <select
                value={insuranceCoverDays}
                onChange={(e) => setInsuranceCoverDays(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs"
              >
                <option value={7}>7 Days ($28)</option>
                <option value={14}>14 Days ($45)</option>
                <option value={30}>30 Days ($75)</option>
              </select>
            </label>
          </div>
        </div>

        <button
          onClick={() => setInsuranceAdded(!insuranceAdded)}
          className={`px-6 py-3 rounded-2xl font-extrabold text-xs transition-all shadow-md ${
            insuranceAdded
              ? 'bg-emerald-500 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          {insuranceAdded ? '✓ Protection Policy Added' : 'Add Policy ($28)'}
        </button>
      </div>
    </div>
  );
};
