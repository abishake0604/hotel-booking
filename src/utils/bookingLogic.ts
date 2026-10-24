import { Hotel, SearchFilters } from '../types/hotel.ts';

export const PROMO_CODES: Record<string, number> = {
  AURASTAYS15: 15, // 15% discount
  WELCOME10: 10,   // 10% discount
  GETAWAY20: 20,   // 20% discount
};

export const TAX_RATE = 0.12; // 12% hotel occupancy tax and fees

/**
 * Calculates number of nights between two date strings (YYYY-MM-DD).
 * Minimum 1 night returned if checkOut <= checkIn.
 */
export function calculateNights(checkInDate: string, checkOutDate: string): number {
  if (!checkInDate || !checkOutDate) return 1;
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

export interface PricingBreakdown {
  nights: number;
  roomsCount: number;
  ratePerNight: number;
  baseTotal: number;
  taxAmount: number;
  discountPercent: number;
  discountAmount: number;
  grandTotal: number;
}

/**
 * Calculates itemized invoice pricing with taxes and applied discounts.
 */
export function calculatePricing(
  ratePerNight: number,
  nights: number,
  roomsCount: number = 1,
  promoDiscountPercent: number = 0,
  taxRate: number = TAX_RATE
): PricingBreakdown {
  const safeNights = Math.max(1, nights);
  const safeRooms = Math.max(1, roomsCount);
  const safeRate = Math.max(0, ratePerNight);

  const baseTotal = safeRate * safeNights * safeRooms;
  const discountPercent = Math.min(100, Math.max(0, promoDiscountPercent));
  const discountAmount = Math.round((baseTotal * (discountPercent / 100)) * 100) / 100;
  const taxableAmount = Math.max(0, baseTotal - discountAmount);
  const taxAmount = Math.round((taxableAmount * taxRate) * 100) / 100;
  const grandTotal = Math.round((taxableAmount + taxAmount) * 100) / 100;

  return {
    nights: safeNights,
    roomsCount: safeRooms,
    ratePerNight: safeRate,
    baseTotal,
    taxAmount,
    discountPercent,
    discountAmount,
    grandTotal,
  };
}

/**
 * Filters and sorts hotels based on search criteria.
 */
export function filterHotels(hotels: Hotel[], filters: SearchFilters): Hotel[] {
  return hotels
    .filter((hotel) => {
      // Destination filter (city, country, or hotel name)
      if (filters.destination && filters.destination.trim() !== '') {
        const query = filters.destination.toLowerCase().trim();
        const matchesCity = hotel.city.toLowerCase().includes(query);
        const matchesCountry = hotel.country.toLowerCase().includes(query);
        const matchesName = hotel.name.toLowerCase().includes(query);
        if (!matchesCity && !matchesCountry && !matchesName) {
          return false;
        }
      }

      // Star rating filter
      if (filters.starRatings.length > 0) {
        if (!filters.starRatings.includes(hotel.starRating)) {
          return false;
        }
      }

      // Property type filter
      if (filters.propertyTypes.length > 0) {
        if (!filters.propertyTypes.includes(hotel.propertyType)) {
          return false;
        }
      }

      // Price range filter
      if (hotel.startingPrice < filters.minPrice || hotel.startingPrice > filters.maxPrice) {
        return false;
      }

      // Selected amenities filter (all selected amenities must be present)
      if (filters.selectedAmenities.length > 0) {
        const hasAllAmenities = filters.selectedAmenities.every((amenity) =>
          hotel.amenities.includes(amenity)
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      // Guest capacity check: hotel must have at least one room that fits guests / roomsCount
      const guestsPerRoom = Math.ceil(filters.guests / Math.max(1, filters.roomsCount));
      const hasSuitableRoom = hotel.rooms.some((room) => room.maxGuests >= guestsPerRoom);
      if (!hasSuitableRoom) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price_asc') {
        return a.startingPrice - b.startingPrice;
      }
      if (filters.sortBy === 'price_desc') {
        return b.startingPrice - a.startingPrice;
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // 'recommended': balance rating and review count
      return (b.rating * Math.log10(b.reviewCount)) - (a.rating * Math.log10(a.reviewCount));
    });
}

/**
 * Generates an authentic booking reference code e.g. "AS-83921".
 */
export function generateBookingReference(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `AS-${num}`;
}

/**
 * Validates a booking submission form.
 */
export function validateBookingForm(form: {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!form.guestName || form.guestName.trim().length < 2) {
    errors.guestName = 'Please enter a valid guest name (at least 2 characters)';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.guestEmail || !emailRegex.test(form.guestEmail.trim())) {
    errors.guestEmail = 'Please provide a valid email address for booking confirmation';
  }

  const phoneDigits = form.guestPhone ? form.guestPhone.replace(/\D/g, '') : '';
  if (!form.guestPhone || phoneDigits.length < 7) {
    errors.guestPhone = 'Please provide a contact phone number';
  }

  if (!form.checkInDate) {
    errors.checkInDate = 'Check-in date is required';
  }

  if (!form.checkOutDate) {
    errors.checkOutDate = 'Check-out date is required';
  } else if (form.checkInDate && form.checkOutDate <= form.checkInDate) {
    errors.checkOutDate = 'Check-out date must be after check-in date';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export const CURRENCY_RATES: Record<string, { symbol: string; rate: number; locale?: string }> = {
  INR: { symbol: '₹', rate: 83.5, locale: 'en-IN' },
  USD: { symbol: '$', rate: 1.0, locale: 'en-US' },
  EUR: { symbol: '€', rate: 0.92, locale: 'de-DE' },
  GBP: { symbol: '£', rate: 0.79, locale: 'en-GB' },
};

export function formatPrice(amountInUSD: number, currencyCode: string = 'INR'): string {
  const currency = CURRENCY_RATES[currencyCode] || CURRENCY_RATES.INR;
  const converted = Math.round(amountInUSD * currency.rate);
  const locale = currency.locale || 'en-IN';
  return `${currency.symbol}${converted.toLocaleString(locale)}`;
}
