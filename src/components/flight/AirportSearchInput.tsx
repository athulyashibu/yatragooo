import React, { useState, useEffect, useRef, useId } from 'react';
import { Plane, Search, X, History, Sparkles, MapPin, Check } from 'lucide-react';
import { Airport, searchAirports, getPopularAirports, getAirportByCode } from '../../data/airportsData';

interface AirportSearchInputProps {
  label: string;
  value: string; // E.g. "New York (JFK)" or "JFK" or object string
  onChange: (airportStr: string, airportObj?: Airport) => void;
  placeholder?: string;
  iconType?: 'origin' | 'destination';
  recentSearchesKey?: string;
}

export const AirportSearchInput: React.FC<AirportSearchInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Search City, Airport, or IATA Code...',
  iconType = 'origin',
  recentSearchesKey = 'voyagego_recent_airports',
}) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<Airport[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownId = useId();

  // Sync internal query state with external value prop
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(recentSearchesKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 4));
        }
      }
    } catch {
      // ignore parsing errors
    }
  }, [recentSearchesKey]);

  // Perform search as user types
  useEffect(() => {
    if (query.trim()) {
      const results = searchAirports(query, 12);
      setSuggestions(results);
    } else {
      // When query is empty, show popular destinations
      setSuggestions(getPopularAirports().slice(0, 8));
    }
    setSelectedIndex(-1);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToRecent = (airport: Airport) => {
    try {
      const filtered = recentSearches.filter((a) => a.code !== airport.code);
      const updated = [airport, ...filtered].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem(recentSearchesKey, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  };

  const handleSelectAirport = (airport: Airport) => {
    const formatted = `${airport.city} (${airport.code})`;
    setQuery(formatted);
    onChange(formatted, airport);
    saveToRecent(airport);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    onChange('');
    setIsOpen(true);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectAirport(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSelectAirport(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
        {label}
      </label>
      <div className="relative flex items-center">
        <Plane
          className={`w-4 h-4 text-orange-500 absolute left-3 z-10 pointer-events-none transition-transform ${
            iconType === 'destination' ? 'transform rotate-90' : ''
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-expanded={isOpen}
          aria-controls={dropdownId}
          className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Suggestions Panel */}
      {isOpen && (
        <div
          id={dropdownId}
          className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 max-h-80 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Recent Searches Section (if query is empty or short) */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-3 bg-slate-50/70">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                <History className="w-3.5 h-3.5 text-orange-500" /> Recent Searches
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((airport) => (
                  <button
                    key={`recent-${airport.code}`}
                    type="button"
                    onClick={() => handleSelectAirport(airport)}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <span className="font-mono font-bold text-orange-600">{airport.code}</span>
                    <span>{airport.city}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Header Title */}
          <div className="px-3 py-2 bg-slate-50/50 flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>{query.trim() ? 'Matching Airports & Cities' : 'Popular Destinations'}</span>
            <span className="text-[10px] font-normal text-slate-400">Search by Code, City, or Airport</span>
          </div>

          {/* Suggestions List */}
          <div className="py-1">
            {suggestions.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching cities or airports found for "{query}".
              </div>
            ) : (
              suggestions.map((airport, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={`${airport.code}-${index}`}
                    onClick={() => handleSelectAirport(airport)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`px-3 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-orange-50 text-orange-950' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-xl bg-orange-100/70 text-orange-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                          <span>{airport.city}</span>
                          <span className="text-[11px] text-slate-400 font-normal">, {airport.country}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate font-medium">
                          {airport.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono font-extrabold px-2 py-0.5 rounded-md">
                        {airport.code}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
