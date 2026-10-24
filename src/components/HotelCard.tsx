import React from 'react';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { Hotel } from '../types/hotel.ts';
import { formatPrice } from '../utils/bookingLogic.ts';
import { HotelVisualArt } from './HotelVisualArt.tsx';

interface HotelCardProps {
  hotel: Hotel;
  currency: string;
  onSelect: (hotel: Hotel) => void;
  nightsCount: number;
}

export const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  currency,
  onSelect,
  nightsCount,
}) => {
  const priceDisplay = formatPrice(hotel.startingPrice, currency);
  const totalForStay = formatPrice(hotel.startingPrice * nightsCount, currency);

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Visual Canvas Slot with Fallback Resilience */}
      <div className="relative h-56 sm:h-64 overflow-hidden bg-stone-900 cursor-pointer" onClick={() => onSelect(hotel)}>
        <HotelVisualArt hotelId={hotel.id} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
        
        {/* Subtle Editorial Top Badges */}
        {hotel.badge && (
          <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-amber-300 text-xs px-2.5 py-1 rounded-md font-medium tracking-wide border border-stone-700/60 shadow-sm">
            {hotel.badge}
          </div>
        )}

        <div className="absolute top-3 right-3 bg-stone-900/85 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-mono flex items-center gap-1 border border-stone-700/60 shadow-sm">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{hotel.rating.toFixed(2)}</span>
        </div>
      </div>

      {/* Card Content & Zero-Pill Metadata */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata Row: Clean Unboxed Text with Separators */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2 truncate">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
              <span>{hotel.city}, {hotel.country}</span>
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{hotel.propertyType}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="tabular-nums font-mono">{hotel.reviewCount} reviews</span>
          </div>

          {/* Hotel Name */}
          <h2
            onClick={() => onSelect(hotel)}
            className="font-serif-luxury text-xl font-semibold text-stone-900 group-hover:text-amber-700 transition-colors cursor-pointer leading-snug"
          >
            {hotel.name}
          </h2>

          <p className="mt-1.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {hotel.tagline}
          </p>

          {/* Amenities Row (Unboxed quiet text) */}
          <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-1 text-[11px] text-stone-500">
            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <React.Fragment key={amenity}>
                <span>{amenity}</span>
                {idx < 2 && <span aria-hidden="true" className="text-stone-300">·</span>}
              </React.Fragment>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-stone-400">+{hotel.amenities.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Pricing & CTA Module */}
        <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-stone-900 tabular-nums font-mono tracking-tight">
                {priceDisplay}
              </span>
              <span className="text-xs text-stone-500">/ night</span>
            </div>
            {nightsCount > 1 && (
              <p className="text-[11px] text-stone-400 tabular-nums font-mono">
                {totalForStay} for {nightsCount} nights
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onSelect(hotel)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors shadow-xs group-hover:bg-amber-600"
          >
            <span>View Rooms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
