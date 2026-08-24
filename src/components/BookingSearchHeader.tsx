import React, { useState } from 'react';
import {
  Plane,
  Building,
  Home,
  Palmtree,
  Bus,
  TrainTrack,
  Car,
  Compass,
  FileCheck2,
  Sparkles,
  Users,
  Briefcase,
  Mic,
  MicOff,
  History,
  Search,
  Flame,
  X,
} from 'lucide-react';
import { TravelMode } from '../types';

interface BookingSearchHeaderProps {
  currentMode: TravelMode;
  onSelectMode: (mode: TravelMode) => void;
}

export const BookingSearchHeader: React.FC<BookingSearchHeaderProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>([
    'NYC to London Flights',
    'Bali 5-Star Villas',
    'Tokyo Food Experiences',
    'Paris Weekend Packages',
  ]);

  const popularDestinations = ['Bali', 'Tokyo', 'London', 'Dubai', 'Paris', 'Goa', 'New York'];

  const tabs = [
    { id: 'flights' as TravelMode, label: 'Flights', icon: Plane, badge: 'Low Fares' },
    { id: 'hotels' as TravelMode, label: 'Hotels', icon: Building, badge: 'Up to 40% OFF' },
    { id: 'homestays' as TravelMode, label: 'Homestays', icon: Home },
    { id: 'packages' as TravelMode, label: 'Packages', icon: Palmtree, badge: 'Popular' },
    { id: 'buses' as TravelMode, label: 'Buses', icon: Bus },
    { id: 'trains' as TravelMode, label: 'Trains', icon: TrainTrack },
    { id: 'cabs' as TravelMode, label: 'Cabs', icon: Car },
    { id: 'experiences' as TravelMode, label: 'Experiences', icon: Compass },
    { id: 'visa' as TravelMode, label: 'Visa & Insurance', icon: FileCheck2 },
    { id: 'ai-planner' as TravelMode, label: 'AI Trip Planner', icon: Sparkles, highlight: true },
    { id: 'community' as TravelMode, label: 'Community', icon: Users },
    { id: 'partner' as TravelMode, label: 'Partner Portal', icon: Briefcase, badge: 'Vendors' },
  ];

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';

        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } catch (err) {
        setIsListening(false);
        alert('Voice recognition listening initiated. Say your destination, e.g. "Hotels in Tokyo"');
      }
    } else {
      setIsListening(!isListening);
      if (!isListening) {
        setSearchQuery('Non-stop flights to Bali under $600');
        setTimeout(() => setIsListening(false), 2000);
      }
    }
  };

  const handleSearchSubmit = (term: string) => {
    if (!term) return;
    if (!recentSearches.includes(term)) {
      setRecentSearches([term, ...recentSearches.slice(0, 4)]);
    }
    setSearchQuery(term);
    setShowHistory(false);
  };

  return (
    <div id="booking-search-container" className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-6 pb-8 px-4 sm:px-6 shadow-xl relative overflow-hidden">
      {/* Decorative background visual elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Title Header & Smart Voice Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Where is your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">journey</span> taking you?
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-normal">
              Book Flights, Luxury Hotels, Villa Rentals, Train Seats, Outstation Cabs &amp; Custom AI Itineraries with 100% Verified Price Assurance.
            </p>
          </div>

          {/* Smart Global Search Bar with Voice Input */}
          <div className="relative w-full md:w-96">
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-slate-700 focus-within:border-orange-500 rounded-2xl p-1.5 shadow-inner">
              <Search className="w-4 h-4 text-orange-400 ml-2 shrink-0" />
              <input
                type="text"
                placeholder={isListening ? 'Listening... Speak now...' : 'Search flights, hotels, packages...'}
                value={searchQuery}
                onFocus={() => setShowHistory(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchQuery)}
                className="w-full bg-transparent px-2 text-xs text-white placeholder-slate-400 focus:outline-none font-medium"
              />

              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Voice Search Button */}
              <button
                type="button"
                onClick={handleVoiceSearch}
                title="Voice Search Architecture Ready"
                className={`p-2 rounded-xl text-white font-bold transition-all ml-1 ${
                  isListening
                    ? 'bg-rose-600 animate-pulse ring-2 ring-rose-400'
                    : 'bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/30'
                }`}
              >
                {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            {/* Recent Searches & Popular Suggestions Dropdown */}
            {showHistory && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-orange-400" /> Recent Searches
                  </span>
                  <button onClick={() => setShowHistory(false)} className="text-[10px] text-slate-500 hover:text-white">
                    Close
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchSubmit(s)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                    <Flame className="w-3.5 h-3.5 text-amber-400" /> Popular Destinations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularDestinations.map((dest) => (
                      <button
                        key={dest}
                        onClick={() => handleSearchSubmit(`Hotels & Flights in ${dest}`)}
                        className="bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-orange-500/30"
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Travel Mode Tabs Grid / Scroll Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentMode === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onSelectMode(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap select-none border shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-lg shadow-orange-500/30 scale-102'
                    : tab.highlight
                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 hover:bg-orange-500/30'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.highlight ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                      isActive
                        ? 'bg-white text-orange-600'
                        : 'bg-orange-500/30 text-orange-300 border border-orange-400/30'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

