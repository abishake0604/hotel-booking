import React from 'react';
import { X, Star, MapPin, Check, ShieldCheck, Users, BedDouble, Maximize2, Sparkles } from 'lucide-react';
import { Hotel, Room } from '../types/hotel.ts';
import { formatPrice } from '../utils/bookingLogic.ts';
import { HotelVisualArt } from './HotelVisualArt.tsx';

interface HotelDetailModalProps {
  hotel: Hotel;
  currency: string;
  nightsCount: number;
  checkInDate: string;
  checkOutDate: string;
  onClose: () => void;
  onSelectRoomForBooking: (hotel: Hotel, room: Room) => void;
}

export const HotelDetailModal: React.FC<HotelDetailModalProps> = ({
  hotel,
  currency,
  nightsCount,
  checkInDate,
  checkOutDate,
  onClose,
  onSelectRoomForBooking,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-300 mb-1">
              <span className="font-semibold">{hotel.starRating}-Star {hotel.propertyType}</span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-300">{hotel.city}, {hotel.country}</span>
            </div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-white">
              {hotel.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Visual Showcase Banner */}
          <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden border border-stone-200 shadow-inner">
            <HotelVisualArt hotelId={hotel.id} className="w-full h-full" />
            <div className="absolute bottom-3 right-3 bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-white border border-stone-700/60 flex items-center gap-2 font-mono">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold">{hotel.rating.toFixed(2)}</span>
              <span className="text-stone-400">({hotel.reviewCount} verified guest reviews)</span>
            </div>
          </div>

          {/* Description & Location Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-2">
                About the property
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed">
                {hotel.description}
              </p>

              {/* Location Highlights */}
              <div className="mt-4 pt-4 border-t border-stone-100">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Location Highlights</span>
                </h4>
                <ul className="space-y-1.5">
                  {hotel.locationHighlights.map((highlight) => (
                    <li key={highlight} className="text-xs text-stone-600 flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Address & Trust Sidebar */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-1">
                  Address
                </p>
                <p className="text-xs text-stone-600 mb-4">{hotel.address}</p>

                <p className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2">
                  Key Amenities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {hotel.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="text-xs text-stone-700 flex items-center gap-1 bg-white border border-stone-200 px-2 py-0.5 rounded-md"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{amenity}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Best Rate Guarantee & Verified Cleanliness</span>
              </div>
            </div>
          </div>

          {/* Rooms Selection Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif-luxury text-xl font-semibold text-stone-900">
                  Select Your Room
                </h3>
                <p className="text-xs text-stone-500">
                  Rates calculated for {nightsCount} {nightsCount === 1 ? 'night' : 'nights'} ({checkInDate} to {checkOutDate})
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {hotel.rooms.map((room) => {
                const roomNightPrice = formatPrice(room.pricePerNight, currency);
                const roomTotalStay = formatPrice(room.pricePerNight * nightsCount, currency);

                return (
                  <div
                    key={room.id}
                    className="border border-stone-200 hover:border-amber-400/80 rounded-xl p-4 sm:p-5 bg-white transition-all duration-200 hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                          {room.type}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="text-xs text-stone-500 font-mono">
                          {room.availableCount} {room.availableCount === 1 ? 'room' : 'rooms'} left
                        </span>
                      </div>
                      <h4 className="text-base font-semibold text-stone-900">
                        {room.name}
                      </h4>

                      {/* Specs */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 mt-2">
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-stone-400" />
                          <span>{room.bedType}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-stone-400" />
                          <span>Up to {room.maxGuests} Guests</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
                          <span>{room.squareMeters} m²</span>
                        </span>
                      </div>

                      {/* Perks */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {room.perks.map((perk) => (
                          <span
                            key={perk}
                            className="text-xs text-emerald-800 bg-emerald-50/80 border border-emerald-200/60 px-2 py-0.5 rounded flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            <span>{perk}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price and Reserve Button */}
                    <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100 shrink-0">
                      <div>
                        <div className="flex items-baseline sm:justify-end gap-1">
                          <span className="text-xl font-bold text-stone-900 font-mono tabular-nums">
                            {roomNightPrice}
                          </span>
                          <span className="text-xs text-stone-500">/ night</span>
                        </div>
                        <p className="text-xs text-stone-500 font-mono tabular-nums">
                          {roomTotalStay} total for {nightsCount} {nightsCount === 1 ? 'night' : 'nights'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectRoomForBooking(hotel, room)}
                        className="mt-2 py-2.5 px-5 bg-stone-900 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                      >
                        Reserve This Room
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
