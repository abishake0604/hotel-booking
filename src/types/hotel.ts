export type PropertyType = 'Resort' | 'Boutique' | 'Hotel' | 'Chalet' | 'Villa';

export interface Room {
  id: string;
  name: string;
  type: 'Standard' | 'Deluxe' | 'Executive Suite' | 'Penthouse Villa';
  bedType: string;
  maxGuests: number;
  squareMeters: number;
  pricePerNight: number;
  perks: string[];
  availableCount: number;
  imageTheme: {
    bgGradient: string;
    accentColor: string;
    symbol: string;
  };
}

export interface Hotel {
  id: string;
  name: string;
  tagline: string;
  city: string;
  country: string;
  address: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  propertyType: PropertyType;
  starRating: 3 | 4 | 5;
  description: string;
  locationHighlights: string[];
  amenities: string[];
  rooms: Room[];
  badge?: string;
  visualTheme: {
    primaryGradient: string;
    accentBg: string;
    accentText: string;
    heroPattern: string;
  };
}

export interface SearchFilters {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  roomsCount: number;
  minPrice: number;
  maxPrice: number;
  starRatings: number[];
  selectedAmenities: string[];
  propertyTypes: PropertyType[];
  sortBy: 'recommended' | 'price_asc' | 'price_desc' | 'rating';
}

export interface Booking {
  id: string;
  referenceCode: string;
  hotelId: string;
  hotelName: string;
  hotelCity: string;
  hotelCountry: string;
  hotelAddress: string;
  roomId: string;
  roomName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guestsCount: number;
  roomsCount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  paymentMethod: 'card' | 'property';
  baseTotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  currency: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
}
