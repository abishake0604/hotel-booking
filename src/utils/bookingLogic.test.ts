import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNights,
  calculatePricing,
  filterHotels,
  validateBookingForm,
  formatPrice,
  PROMO_CODES,
} from './bookingLogic.ts';
import { Hotel, SearchFilters } from '../types/hotel.ts';

test('calculateNights computes nights accurately and guards invalid bounds', () => {
  assert.equal(calculateNights('2026-11-01', '2026-11-05'), 4);
  assert.equal(calculateNights('2026-11-01', '2026-11-02'), 1);
  // Same day or backward date defaults to 1 night minimum
  assert.equal(calculateNights('2026-11-05', '2026-11-05'), 1);
  assert.equal(calculateNights('2026-11-05', '2026-11-02'), 1);
  // Empty dates
  assert.equal(calculateNights('', ''), 1);
});

test('calculatePricing correctly calculates subtotal, discounts, and taxes', () => {
  // 3 nights, 1 room, $200/night = $600 base
  // 0% discount, 12% tax -> $600 * 0.12 = $72 tax -> $672 grand total
  const p1 = calculatePricing(200, 3, 1, 0, 0.12);
  assert.equal(p1.baseTotal, 600);
  assert.equal(p1.discountAmount, 0);
  assert.equal(p1.taxAmount, 72);
  assert.equal(p1.grandTotal, 672);

  // With 15% discount (AURASTAYS15)
  // Base = 600, discount = 90, taxable = 510, tax = 510 * 0.12 = 61.2, grand total = 571.2
  const p2 = calculatePricing(200, 3, 1, PROMO_CODES.AURASTAYS15, 0.12);
  assert.equal(p2.baseTotal, 600);
  assert.equal(p2.discountAmount, 90);
  assert.equal(p2.taxAmount, 61.2);
  assert.equal(p2.grandTotal, 571.2);

  // Multi-room (2 rooms)
  const p3 = calculatePricing(150, 2, 2, 0, 0.10);
  // 150 * 2 nights * 2 rooms = 600 base
  assert.equal(p3.baseTotal, 600);
  assert.equal(p3.taxAmount, 60);
  assert.equal(p3.grandTotal, 660);
});

test('validateBookingForm verifies essential guest and stay details', () => {
  const valid = validateBookingForm({
    guestName: 'Elena Rostova',
    guestEmail: 'elena@example.com',
    guestPhone: '+1 555-0192',
    checkInDate: '2026-11-10',
    checkOutDate: '2026-11-14',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);

  const invalid = validateBookingForm({
    guestName: '',
    guestEmail: 'invalid-email',
    guestPhone: '',
    checkInDate: '2026-11-14',
    checkOutDate: '2026-11-10', // Before check-in
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.guestName);
  assert.ok(invalid.errors.guestEmail);
  assert.ok(invalid.errors.guestPhone);
  assert.ok(invalid.errors.checkOutDate);
});

test('filterHotels correctly filters by destination, star rating, price, and amenities', () => {
  const sampleHotels: Hotel[] = [
    {
      id: 'h1',
      name: 'Azure Cliff Resort',
      tagline: 'Coastal luxury',
      city: 'Amalfi',
      country: 'Italy',
      address: 'Via Panoramica 12',
      rating: 4.9,
      reviewCount: 320,
      startingPrice: 350,
      propertyType: 'Resort',
      starRating: 5,
      description: 'Luxury cliffside resort with infinity pool.',
      locationHighlights: ['Direct beach access'],
      amenities: ['Pool', 'Spa', 'Free Breakfast', 'Ocean View'],
      rooms: [
        {
          id: 'r1',
          name: 'Deluxe Sea View',
          type: 'Deluxe',
          bedType: '1 King Bed',
          maxGuests: 2,
          squareMeters: 45,
          pricePerNight: 350,
          perks: ['Free Breakfast'],
          availableCount: 3,
          imageTheme: { bgGradient: '', accentColor: '', symbol: '' },
        },
      ],
      visualTheme: { primaryGradient: '', accentBg: '', accentText: '', heroPattern: '' },
    },
    {
      id: 'h2',
      name: 'Tokyo Zen Boutique',
      tagline: 'Urban serenity',
      city: 'Tokyo',
      country: 'Japan',
      address: 'Ginza 4-Chome',
      rating: 4.7,
      reviewCount: 180,
      startingPrice: 220,
      propertyType: 'Boutique',
      starRating: 4,
      description: 'Minimalist boutique hotel in downtown Ginza.',
      locationHighlights: ['Near subway'],
      amenities: ['Wifi', 'Fitness Center', 'Free Breakfast'],
      rooms: [
        {
          id: 'r2',
          name: 'Zen Room',
          type: 'Standard',
          bedType: '1 Queen Bed',
          maxGuests: 2,
          squareMeters: 30,
          pricePerNight: 220,
          perks: ['High speed Wifi'],
          availableCount: 4,
          imageTheme: { bgGradient: '', accentColor: '', symbol: '' },
        },
      ],
      visualTheme: { primaryGradient: '', accentBg: '', accentText: '', heroPattern: '' },
    },
  ];

  const defaultFilters: SearchFilters = {
    destination: 'Amalfi',
    checkInDate: '2026-11-01',
    checkOutDate: '2026-11-03',
    guests: 2,
    roomsCount: 1,
    minPrice: 100,
    maxPrice: 600,
    starRatings: [],
    selectedAmenities: [],
    propertyTypes: [],
    sortBy: 'recommended',
  };

  const amalfiResults = filterHotels(sampleHotels, defaultFilters);
  assert.equal(amalfiResults.length, 1);
  assert.equal(amalfiResults[0].id, 'h1');

  // Filter with amenity requirement 'Spa'
  const spaResults = filterHotels(sampleHotels, {
    ...defaultFilters,
    destination: '',
    selectedAmenities: ['Spa'],
  });
  assert.equal(spaResults.length, 1);
  assert.equal(spaResults[0].name, 'Azure Cliff Resort');

  // Price range excluding Amalfi ($350)
  const budgetResults = filterHotels(sampleHotels, {
    ...defaultFilters,
    destination: '',
    minPrice: 100,
    maxPrice: 250,
  });
  assert.equal(budgetResults.length, 1);
  assert.equal(budgetResults[0].id, 'h2');
});

test('formatPrice formats currency correctly with rates', () => {
  assert.equal(formatPrice(100, 'INR'), '₹8,350');
  assert.equal(formatPrice(100, 'USD'), '$100');
  assert.equal(formatPrice(100, 'EUR'), '€92');
  assert.equal(formatPrice(100, 'GBP'), '£79');
});
