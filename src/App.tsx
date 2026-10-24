import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSearch } from './components/HeroSearch.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { HotelCard } from './components/HotelCard.tsx';
import { HotelDetailModal } from './components/HotelDetailModal.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { BookingConfirmationModal } from './components/BookingConfirmationModal.tsx';
import { MyBookingsModal } from './components/MyBookingsModal.tsx';
import { INITIAL_HOTELS } from './data/hotelsData.ts';
import { Hotel, Room, SearchFilters, Booking } from './types/hotel.ts';
import { filterHotels, calculateNights } from './utils/bookingLogic.ts';
import { Sparkles, Shield, HeartHandshake, Compass } from 'lucide-react';

const STORAGE_KEY = 'aurastays_bookings_v3';

// Helper to provide realistic dates (tomorrow + 3 days)
function getDefaultDates() {
  const today = new Date();
  const checkIn = new Date(today);
  checkIn.setDate(today.getDate() + 7);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkIn.getDate() + 3);

  return {
    inStr: checkIn.toISOString().split('T')[0],
    outStr: checkOut.toISOString().split('T')[0],
  };
}

export default function App() {
  const { inStr, outStr } = useMemo(() => getDefaultDates(), []);

  // Search & Filter State
  const [filters, setFilters] = useState<SearchFilters>({
    destination: '',
    checkInDate: inStr,
    checkOutDate: outStr,
    guests: 2,
    roomsCount: 1,
    minPrice: 100,
    maxPrice: 1000,
    starRatings: [],
    selectedAmenities: [],
    propertyTypes: [],
    sortBy: 'recommended',
  });

  const [currency, setCurrency] = useState<string>('INR');
  const [activeTab, setActiveTab] = useState<'explore' | 'bookings'>('explore');

  // Modal States
  const [selectedHotelForDetail, setSelectedHotelForDetail] = useState<Hotel | null>(null);
  const [bookingSession, setBookingSession] = useState<{ hotel: Hotel; room: Room } | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Bookings Store (with initial demo stay)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // Seed default booking for immediate testability in INR
    return [
      {
        id: 'bk-demo-1',
        referenceCode: 'AS-84912',
        hotelId: 'hotel-azure-amalfi',
        hotelName: 'Azure Cliff Palace & Spa',
        hotelCity: 'Amalfi',
        hotelCountry: 'Italy',
        hotelAddress: 'Via Panoramica 48, 84011 Amalfi, SA, Italy',
        roomId: 'azure-classic',
        roomName: 'Deluxe Sea Breeze Room',
        roomType: 'Deluxe',
        checkInDate: inStr,
        checkOutDate: outStr,
        nights: 3,
        guestsCount: 2,
        roomsCount: 1,
        guestName: 'Elena Rostova',
        guestEmail: 'elena.rostova@example.com',
        guestPhone: '+1 (555) 234-5678',
        specialRequests: 'High floor, quiet cliffside room facing sunset',
        paymentMethod: 'card',
        baseTotal: 95190,
        taxAmount: 11423,
        discountAmount: 14278,
        grandTotal: 92335,
        currency: 'INR',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // Sync bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // storage unavailable
    }
  }, [bookings]);

  // Derived filtered results
  const filteredHotels = useMemo(() => {
    return filterHotels(INITIAL_HOTELS, filters);
  }, [filters]);

  const nightsCount = useMemo(() => {
    return calculateNights(filters.checkInDate, filters.checkOutDate);
  }, [filters.checkInDate, filters.checkOutDate]);

  const handleResetFilters = () => {
    setFilters({
      destination: '',
      checkInDate: inStr,
      checkOutDate: outStr,
      guests: 2,
      roomsCount: 1,
      minPrice: 100,
      maxPrice: 1000,
      starRatings: [],
      selectedAmenities: [],
      propertyTypes: [],
      sortBy: 'recommended',
    });
  };

  const handleStartBooking = (hotel: Hotel, room: Room) => {
    setSelectedHotelForDetail(null);
    setBookingSession({ hotel, room });
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setBookingSession(null);
    setConfirmedBooking(newBooking);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-400 selection:text-stone-900">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        bookingsCount={bookings.filter((b) => b.status === 'confirmed').length}
        currency={currency}
        onChangeCurrency={setCurrency}
        onScrollToSearch={() => {
          setActiveTab('explore');
          const el = document.getElementById('search-anchor');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {activeTab === 'explore' ? (
        <main className="flex-1">
          {/* Hero Section & Search Bar */}
          <div id="search-anchor">
            <HeroSearch
              destination={filters.destination}
              onDestinationChange={(dest) => setFilters((prev) => ({ ...prev, destination: dest }))}
              checkInDate={filters.checkInDate}
              onCheckInChange={(date) => setFilters((prev) => ({ ...prev, checkInDate: date }))}
              checkOutDate={filters.checkOutDate}
              onCheckOutChange={(date) => setFilters((prev) => ({ ...prev, checkOutDate: date }))}
              guests={filters.guests}
              onGuestsChange={(g) => setFilters((prev) => ({ ...prev, guests: g }))}
              roomsCount={filters.roomsCount}
              onRoomsCountChange={(r) => setFilters((prev) => ({ ...prev, roomsCount: r }))}
              onSearch={() => {
                const el = document.getElementById('featured-hotels');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              totalHotelsCount={filteredHotels.length}
            />
          </div>

          {/* Interactive Filters Strip */}
          <FilterBar
            filters={filters}
            onChangeFilters={setFilters}
            onResetFilters={handleResetFilters}
            resultsCount={filteredHotels.length}
            currency={currency}
          />

          {/* Hotels Grid Section */}
          <section id="featured-hotels" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-stone-900">
                  {filters.destination ? `Stays matching "${filters.destination}"` : 'Featured Luxury Stays'}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Hand-verified properties offering unique architecture, prime locations, and guaranteed service standards.
                </p>
              </div>
              <span className="text-xs font-mono text-stone-500">
                {nightsCount} {nightsCount === 1 ? 'night' : 'nights'} ({filters.checkInDate} — {filters.checkOutDate})
              </span>
            </div>

            {/* Empty State */}
            {filteredHotels.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm my-6">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif-luxury text-lg font-semibold text-stone-800 mb-1">
                  No properties match your current criteria
                </h3>
                <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                  Try clearing some filters, widening your price range, or searching for all stays.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    currency={currency}
                    nightsCount={nightsCount}
                    onSelect={(h) => setSelectedHotelForDetail(h)}
                  />
                ))}
              </div>
            )}

            {/* Editorial Value Proposition Section */}
            <div className="mt-16 pt-12 border-t border-stone-200">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <p className="text-amber-700 text-xs font-semibold uppercase tracking-wider mb-1">
                  The AuraStays Standard
                </p>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-stone-900">
                  Thoughtful travel, seamlessly executed
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-luxury text-lg font-semibold text-stone-900 mb-2">
                    01. Hand-Inspected Quality
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Every property in our portfolio is visited and vetted across 50 hospitality criteria including bed acoustics, bathroom finish, and linen comfort.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-4">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-luxury text-lg font-semibold text-stone-900 mb-2">
                    02. Price Match Guarantee
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Book with confidence knowing you receive direct-from-property rates with transparent tax breakdowns and zero surprise resort markups.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-4">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-luxury text-lg font-semibold text-stone-900 mb-2">
                    03. Flexible Booking & Support
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Plans change. Enjoy 48-hour free cancellation on all standard rates, and reach our dedicated concierge team any time of day or night.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main className="flex-1">
          <MyBookingsModal
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onExploreHotels={() => setActiveTab('explore')}
          />
        </main>
      )}

      {/* Hotel Detail Modal */}
      {selectedHotelForDetail && (
        <HotelDetailModal
          hotel={selectedHotelForDetail}
          currency={currency}
          nightsCount={nightsCount}
          checkInDate={filters.checkInDate}
          checkOutDate={filters.checkOutDate}
          onClose={() => setSelectedHotelForDetail(null)}
          onSelectRoomForBooking={handleStartBooking}
        />
      )}

      {/* Booking Checkout Modal */}
      {bookingSession && (
        <BookingModal
          hotel={bookingSession.hotel}
          room={bookingSession.room}
          checkInDate={filters.checkInDate}
          checkOutDate={filters.checkOutDate}
          guests={filters.guests}
          roomsCount={filters.roomsCount}
          currency={currency}
          onClose={() => setBookingSession(null)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {/* Booking Voucher / Confirmation Modal */}
      {confirmedBooking && (
        <BookingConfirmationModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
          onViewAllBookings={() => {
            setConfirmedBooking(null);
            setActiveTab('bookings');
          }}
        />
      )}

      {/* Clean Global Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-stone-800 mt-auto text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury text-white font-semibold text-base">AuraStays</span>
            <span className="text-stone-600">·</span>
            <span>Handpicked Boutique Hospitality</span>
          </div>

          <div className="flex items-center gap-6 text-stone-400">
            <button
              onClick={() => {
                setActiveTab('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors"
            >
              Explore Stays
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className="hover:text-white transition-colors"
            >
              My Bookings
            </button>
            <span className="text-stone-600">|</span>
            <span>Currency: <strong className="text-white">{currency}</strong></span>
          </div>

          <p className="text-stone-500 text-[11px]">
            © {new Date().getFullYear()} AuraStays Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
