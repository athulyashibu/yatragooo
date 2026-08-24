import React, { useState } from 'react';
import { Sparkles, Compass, MapPin, Calendar, DollarSign, Users, Utensils, Lightbulb, CheckSquare, BookmarkPlus, ArrowRight, Loader2 } from 'lucide-react';
import { AITripPlan } from '../../types';

export const AITripPlannerView: React.FC = () => {
  const [destination, setDestination] = useState('Bali, Indonesia');
  const [durationDays, setDurationDays] = useState(5);
  const [budget, setBudget] = useState('Moderate');
  const [tripStyle, setTripStyle] = useState('Balanced Explorer');
  const [companions, setCompanions] = useState('Couples / Friends');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Culture', 'Food', 'Scenic Spots']);

  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<AITripPlan | null>(null);

  const interestOptions = ['Culture & Temples', 'Food & Culinary', 'Beaches & Water Sports', 'Nightlife & Clubs', 'Nature & Hiking', 'Luxury Spa'];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          durationDays,
          budget,
          tripStyle,
          companions,
          interests: selectedInterests,
        }),
      });
      if (!res.ok) {
        throw new Error(`AI Trip Planner API request failed with status ${res.status}`);
      }
      const ct = res.headers.get('content-type');
      if (!ct || !ct.includes('application/json')) {
        throw new Error(`Expected JSON from AI Trip Planner API, got ${ct}`);
      }
      const data = await res.json();
      if (data.plan) {
        setGeneratedPlan(data.plan);
      }
    } catch (err) {
      console.error('Error in trip plan API:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-trip-planner-module" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-orange-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Powered by Gemini 3.6 Flash
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Travel Architect &amp; Itinerary Generator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Tell us your dream destination and preferences. Our AI will curate a personalized day-by-day itinerary with insider spots, local delicacies &amp; budget estimates in seconds.
          </p>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Destination */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Destination</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-orange-500 absolute left-3 top-3" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kyoto, Switzerland, Paris, Goa"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Duration Days */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Trip Duration ({durationDays} Days)</label>
            <input
              type="range"
              min="2"
              max="14"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer mt-2"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Budget Preference</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500"
            >
              <option value="Backpacker / Budget">Backpacker / Budget</option>
              <option value="Moderate">Moderate Comfortable</option>
              <option value="Luxury / 5-Star">Luxury / 5-Star</option>
            </select>
          </div>
        </div>

        {/* Interests Pills */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">Select What Interests You</label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-orange-300'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}{interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGeneratePlan}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 hover:scale-101 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Architecting Your Itinerary with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Generate Smart AI Itinerary</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Itinerary Output */}
      {generatedPlan && (
        <div id="ai-itinerary-output" className="space-y-6 animate-in fade-in duration-300">
          {/* Summary Header */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                  AI Tailored Itinerary
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{generatedPlan.destination} ({generatedPlan.durationDays} Days)</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Estimated Total Budget</span>
                <p className="text-xl font-extrabold text-orange-600">{generatedPlan.totalBudgetEstimate}</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
              "{generatedPlan.vibeSummary}"
            </p>
          </div>

          {/* Day by Day Cards */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm">Day-by-Day Schedule</h4>
            {generatedPlan.dayByDay?.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="bg-orange-500 text-white text-xs font-extrabold px-3 py-0.5 rounded-lg">
                    DAY {day.day}: {day.title}
                  </span>
                  <span className="text-xs font-bold text-slate-600">Est. Daily Expense: {day.estimatedCost}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                    <strong className="text-amber-800 block mb-1">🌅 Morning</strong>
                    <p className="text-slate-700">{day.morning}</p>
                  </div>
                  <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-100">
                    <strong className="text-orange-800 block mb-1">☀️ Afternoon</strong>
                    <p className="text-slate-700">{day.afternoon}</p>
                  </div>
                  <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
                    <strong className="text-indigo-800 block mb-1">🌙 Evening</strong>
                    <p className="text-slate-700">{day.evening}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Must Try Foods & Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                <Utensils className="w-4 h-4 text-orange-500" /> Must-Try Foods
              </h4>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                {generatedPlan.mustTryFoods?.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Local Insider Tips
              </h4>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                {generatedPlan.localInsiderTips?.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-500" /> Packing Checklist
              </h4>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                {generatedPlan.packingChecklist?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
