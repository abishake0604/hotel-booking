import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin, X } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../data/hotelsData.ts';

interface HeroSearchProps {
  destination: string;
  onDestinationChange: (dest: string) => void;
  checkInDate: string;
  onCheckInChange: (date: string) => void;
  checkOutDate: string;
  onCheckOutChange: (date: string) => void;
  guests: number;
  onGuestsChange: (guests: number) => void;
  roomsCount: number;
  onRoomsCountChange: (rooms: number) => void;
  onSearch: () => void;
  totalHotelsCount: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  destination,
  onDestinationChange,
  checkInDate,
  onCheckInChange,
  checkOutDate,
  onCheckOutChange,
  guests,
  onGuestsChange,
  roomsCount,
  onRoomsCountChange,
  onSearch,
  totalHotelsCount,
}) => {
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  return (
    <section className="relative bg-stone-900 text-stone-100 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-stone-800 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl mb-8">
          <p className="text-amber-400 font-medium text-xs tracking-wider uppercase mb-2">
            Curated Hospitality Collection
          </p>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
            Find sanctuary in the world’s most extraordinary places.
          </h1>
          <p className="mt-3 text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Reserve boutique coastal retreats, mountain chalets, and historic urban lofts with guaranteed best rates and transparent terms.
          </p>
        </div>

        {/* The Search Bar Module */}
        <div className="bg-stone-800/95 backdrop-blur-md border border-stone-700/80 rounded-2xl p-3 sm:p-4 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Destination Input */}
            <div className="md:col-span-4 relative">
              <label htmlFor="destination-input" className="block text-stone-400 text-xs font-medium mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Destination or Hotel</span>
              </label>
              <div className="relative">
                <input
                  id="destination-input"
                  type="text"
                  placeholder="Where would you like to stay?"
                  value={destination}
                  onChange={(e) => onDestinationChange(e.target.value)}
                  className="w-full bg-stone-900/90 border border-stone-700 text-white placeholder-stone-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
                {destination && (
                  <button
                    onClick={() => onDestinationChange('')}
                    aria-label="Clear destination"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Check-In Date */}
            <div className="md:col-span-2 relative">
              <label htmlFor="checkin-date-input" className="block text-stone-400 text-xs font-medium mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Check-in</span>
              </label>
              <input
                id="checkin-date-input"
                type="date"
                value={checkInDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  onCheckInChange(e.target.value);
                  if (checkOutDate && e.target.value >= checkOutDate) {
                    // Automatically bump checkout if needed
                    const nextDay = new Date(e.target.value);
                    nextDay.setDate(nextDay.getDate() + 1);
                    onCheckOutChange(nextDay.toISOString().split('T')[0]);
                  }
                }}
                className="w-full bg-stone-900/90 border border-stone-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Check-Out Date */}
            <div className="md:col-span-2 relative">
              <label htmlFor="checkout-date-input" className="block text-stone-400 text-xs font-medium mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Check-out</span>
              </label>
              <input
                id="checkout-date-input"
                type="date"
                value={checkOutDate}
                min={checkInDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => onCheckOutChange(e.target.value)}
                className="w-full bg-stone-900/90 border border-stone-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Guests & Rooms */}
            <div className="md:col-span-2 relative">
              <label className="block text-stone-400 text-xs font-medium mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Guests & Rooms</span>
              </label>
              <button
                type="button"
                onClick={() => setShowGuestPicker(!showGuestPicker)}
                className="w-full text-left bg-stone-900/90 border border-stone-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 hover:border-stone-600 truncate"
              >
                {guests} {guests === 1 ? 'Guest' : 'Guests'}, {roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'}
              </button>

              {/* Guest/Room Popover */}
              {showGuestPicker && (
                <div className="absolute top-full mt-2 left-0 right-0 sm:w-64 bg-stone-900 border border-stone-700 rounded-xl p-4 shadow-xl z-50">
                  <div className="flex items-center justify-between py-2 border-b border-stone-800">
                    <div>
                      <p className="text-sm font-medium text-stone-200">Guests</p>
                      <p className="text-xs text-stone-400">Total travelers</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onGuestsChange(Math.max(1, guests - 1))}
                        disabled={guests <= 1}
                        className="w-8 h-8 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-200 hover:bg-stone-700 disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-mono">{guests}</span>
                      <button
                        type="button"
                        onClick={() => onGuestsChange(Math.min(8, guests + 1))}
                        disabled={guests >= 8}
                        className="w-8 h-8 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-200 hover:bg-stone-700 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2 pt-3">
                    <div>
                      <p className="text-sm font-medium text-stone-200">Rooms</p>
                      <p className="text-xs text-stone-400">Room count</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onRoomsCountChange(Math.max(1, roomsCount - 1))}
                        disabled={roomsCount <= 1}
                        className="w-8 h-8 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-200 hover:bg-stone-700 disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-mono">{roomsCount}</span>
                      <button
                        type="button"
                        onClick={() => onRoomsCountChange(Math.min(4, roomsCount + 1))}
                        disabled={roomsCount >= 4}
                        className="w-8 h-8 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-200 hover:bg-stone-700 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowGuestPicker(false)}
                    className="w-full mt-3 py-1.5 text-xs font-medium text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                  >
                    Apply Selection
                  </button>
                </div>
              )}
            </div>

            {/* Search Action CTA */}
            <div className="md:col-span-2 pt-1 sm:pt-4">
              <button
                type="button"
                onClick={onSearch}
                className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-900 font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm font-sans"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Quick Destination Presets */}
          <div className="mt-3 pt-3 border-t border-stone-700/60 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-stone-400 whitespace-nowrap shrink-0">Popular:</span>
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                type="button"
                onClick={() => onDestinationChange(dest.query)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  destination === dest.query
                    ? 'bg-amber-400 text-stone-900 font-medium'
                    : 'bg-stone-900/60 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {dest.name}
              </button>
            ))}
          </div>
        </div>

        {/* Claim-to-Proof Adjacency Row */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            <span>Handpicked boutique & luxury properties</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            <span>Zero hidden booking fees</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            <span>Complimentary breakfast at selected stays</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            <span>Free cancellation up to 48 hours prior</span>
          </div>
        </div>
      </div>
    </section>
  );
};
