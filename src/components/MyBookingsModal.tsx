import React, { useState } from 'react';
import { Calendar, MapPin, Building, Trash2, ArrowRight } from 'lucide-react';
import { Booking } from '../types/hotel.ts';
import { formatPrice } from '../utils/bookingLogic.ts';

interface MyBookingsModalProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onExploreHotels: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  bookings,
  onCancelBooking,
  onExploreHotels,
}) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleConfirmCancel = (id: string) => {
    onCancelBooking(id);
    setCancellingId(null);
  };

  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-stone-900">
            My Reservations
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review and manage your upcoming stays, itinerary codes, and vouchers.
          </p>
        </div>
        <button
          type="button"
          onClick={onExploreHotels}
          className="self-start sm:self-auto px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span>Explore Stays</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto mb-4 text-stone-400">
            <Building className="w-8 h-8" />
          </div>
          <h2 className="font-serif-luxury text-lg font-semibold text-stone-800 mb-1">
            No Bookings Yet
          </h2>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            You haven't reserved any stays yet. Explore our curated portfolio of seaside resorts, mountain retreats, and boutique city hotels.
          </p>
          <button
            type="button"
            onClick={onExploreHotels}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-xs rounded-xl shadow-sm transition-colors"
          >
            Find Your Next Stay
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {activeBookings.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-3">
                Upcoming Stays ({activeBookings.length})
              </h2>

              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            {booking.referenceCode}
                          </span>
                          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                            Confirmed
                          </span>
                        </div>
                        <h3 className="font-serif-luxury text-xl font-semibold text-stone-900 mt-1">
                          {booking.hotelName}
                        </h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{booking.hotelAddress}</span>
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-xs text-stone-500 block">Total Price</span>
                        <span className="font-mono text-lg font-bold text-stone-900 tabular-nums">
                          {formatPrice(booking.grandTotal, booking.currency)}
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          {booking.paymentMethod === 'card' ? 'Paid via Card' : 'Pay at property'}
                        </span>
                      </div>
                    </div>

                    {/* Stay Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-stone-100 text-xs">
                      <div>
                        <p className="text-stone-400 text-[10px]">Room Type</p>
                        <p className="font-medium text-stone-800">{booking.roomName}</p>
                      </div>
                      <div>
                        <p className="text-stone-400 text-[10px]">Dates</p>
                        <p className="font-medium text-stone-800 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>{booking.checkInDate} to {booking.checkOutDate}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-400 text-[10px]">Duration</p>
                        <p className="font-medium text-stone-800 tabular-nums font-mono">
                          {booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'} ({booking.guestsCount} Guests)
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-400 text-[10px]">Reserved Under</p>
                        <p className="font-medium text-stone-800">{booking.guestName}</p>
                      </div>
                    </div>

                    {/* Cancel Action */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-stone-400">
                        Check-in starts at 3:00 PM on arrival date
                      </span>

                      {cancellingId === booking.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-rose-600">Cancel this reservation?</span>
                          <button
                            type="button"
                            onClick={() => handleConfirmCancel(booking.id)}
                            className="px-2.5 py-1 bg-rose-600 text-white rounded text-xs font-medium hover:bg-rose-700"
                          >
                            Yes, Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => setCancellingId(null)}
                            className="px-2.5 py-1 bg-stone-200 text-stone-700 rounded text-xs hover:bg-stone-300"
                          >
                            Keep
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCancellingId(booking.id)}
                          className="text-stone-400 hover:text-rose-600 text-xs flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Cancel Booking</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past / Cancelled Section */}
          {cancelledBookings.length > 0 && (
            <div className="pt-4">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-3">
                Cancelled Stays ({cancelledBookings.length})
              </h2>
              <div className="space-y-3 opacity-60">
                {cancelledBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono text-stone-500 mr-2">{b.referenceCode}</span>
                      <strong className="text-stone-700">{b.hotelName}</strong>
                      <span className="text-stone-500 ml-2">({b.checkInDate} to {b.checkOutDate})</span>
                    </div>
                    <span className="text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-medium">
                      Cancelled
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
