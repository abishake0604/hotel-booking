import React from 'react';
import { Bookmark, Compass } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'bookings';
  onSelectTab: (tab: 'explore' | 'bookings') => void;
  bookingsCount: number;
  currency: string;
  onChangeCurrency: (currency: string) => void;
  onScrollToSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  bookingsCount,
  currency,
  onChangeCurrency,
  onScrollToSearch,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title (Single text element wordmark) */}
        <button
          onClick={() => {
            onSelectTab('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-left group flex items-center gap-2.5 focus:outline-none whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-serif font-bold text-lg">
            A
          </div>
          <span className="font-serif-luxury text-xl sm:text-2xl font-semibold tracking-tight text-white group-hover:text-amber-200 transition-colors">
            AuraStays
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
          <button
            onClick={() => {
              onSelectTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'explore' ? 'text-amber-400 font-semibold' : 'text-stone-300'
            }`}
          >
            Explore Stays
          </button>
          <button
            onClick={onScrollToSearch}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Destinations
          </button>
          <a
            href="#featured-hotels"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Featured Resorts
          </a>
          <button
            onClick={() => onSelectTab('bookings')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeTab === 'bookings' ? 'text-amber-400 font-semibold' : 'text-stone-300'
            }`}
          >
            <span>My Bookings</span>
            {bookingsCount > 0 && (
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono tabular-nums">
                {bookingsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area with Currency Selector */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Currency Selector */}
          <div className="relative inline-flex items-center">
            <select
              aria-label="Select Currency"
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value)}
              className="bg-stone-800 border border-stone-700 text-stone-200 text-xs font-medium rounded-lg px-2.5 py-2 hover:border-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          {/* Bookings / Search CTA */}
          <button
            onClick={() => onSelectTab(activeTab === 'bookings' ? 'explore' : 'bookings')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 font-sans shadow-sm"
          >
            {activeTab === 'bookings' ? (
              <>
                <Compass className="w-3.5 h-3.5" />
                <span>Browse Stays</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Bookings{bookingsCount > 0 ? ` (${bookingsCount})` : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
