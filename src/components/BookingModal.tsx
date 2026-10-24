import React, { useState } from 'react';
import { X, Calendar, Users, CreditCard, Building2, Tag, ShieldAlert, Check } from 'lucide-react';
import { Hotel, Room, Booking } from '../types/hotel.ts';
import {
  calculatePricing,
  validateBookingForm,
  generateBookingReference,
  formatPrice,
  PROMO_CODES,
  TAX_RATE,
} from '../utils/bookingLogic.ts';

interface BookingModalProps {
  hotel: Hotel;
  room: Room;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  roomsCount: number;
  currency: string;
  onClose: () => void;
  onBookingConfirmed: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  hotel,
  room,
  checkInDate,
  checkOutDate,
  guests,
  roomsCount,
  currency,
  onClose,
  onBookingConfirmed,
}) => {
  // Form State
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'property'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute nights
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = end.getTime() - start.getTime();
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const pricing = calculatePricing(
    room.pricePerNight,
    nights,
    roomsCount,
    appliedPromo ? appliedPromo.percent : 0,
    TAX_RATE
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoInput.trim().toUpperCase();
    if (!cleanCode) return;

    if (PROMO_CODES[cleanCode]) {
      setAppliedPromo({ code: cleanCode, percent: PROMO_CODES[cleanCode] });
      setPromoError('');
    } else {
      setPromoError('Invalid promotional code. Try AURASTAYS15 or WELCOME10.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBookingForm({
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 12) {
        setErrors((prev) => ({ ...prev, card: 'Please enter a valid card number' }));
        return;
      }
    }

    setIsSubmitting(true);
    setErrors({});

    setTimeout(() => {
      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        referenceCode: generateBookingReference(),
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelCity: hotel.city,
        hotelCountry: hotel.country,
        hotelAddress: hotel.address,
        roomId: room.id,
        roomName: room.name,
        roomType: room.type,
        checkInDate,
        checkOutDate,
        nights,
        guestsCount: guests,
        roomsCount,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        specialRequests: specialRequests.trim() || undefined,
        paymentMethod,
        baseTotal: pricing.baseTotal,
        taxAmount: pricing.taxAmount,
        discountAmount: pricing.discountAmount,
        grandTotal: pricing.grandTotal,
        currency,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      onBookingConfirmed(newBooking);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div>
            <p className="text-xs text-amber-300 uppercase tracking-wider font-medium">
              Reservation Checkout
            </p>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-white">
              Complete Your Stay at {hotel.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 max-h-[78vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Guest Information & Payment Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Stay Itinerary Summary Pill */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-stone-900 text-sm">{room.name}</h3>
                    <p className="text-xs text-stone-500">{hotel.city}, {hotel.country}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-stone-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      {room.type}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <div>
                      <p className="text-[10px] text-stone-400">Check-in</p>
                      <p className="font-medium text-stone-800">{checkInDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <div>
                      <p className="text-[10px] text-stone-400">Check-out</p>
                      <p className="font-medium text-stone-800">{checkOutDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <div>
                      <p className="text-[10px] text-stone-400">Occupancy</p>
                      <p className="font-medium text-stone-800">{guests} Guests, {roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div>
                <h3 className="text-sm font-semibold text-stone-900 mb-3 uppercase tracking-wider">
                  Guest Details
                </h3>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="guest-name" className="block text-xs font-medium text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="guest-name"
                      type="text"
                      placeholder="e.g. Katherine Vance"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className={`w-full bg-white border ${
                        errors.guestName ? 'border-rose-500' : 'border-stone-200'
                      } rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500`}
                    />
                    {errors.guestName && (
                      <p className="text-xs text-rose-600 mt-1">{errors.guestName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="guest-email" className="block text-xs font-medium text-stone-700 mb-1">
                        Email Address (for voucher) *
                      </label>
                      <input
                        id="guest-email"
                        type="email"
                        placeholder="katherine@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className={`w-full bg-white border ${
                          errors.guestEmail ? 'border-rose-500' : 'border-stone-200'
                        } rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500`}
                      />
                      {errors.guestEmail && (
                        <p className="text-xs text-rose-600 mt-1">{errors.guestEmail}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="guest-phone" className="block text-xs font-medium text-stone-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        id="guest-phone"
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className={`w-full bg-white border ${
                          errors.guestPhone ? 'border-rose-500' : 'border-stone-200'
                        } rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500`}
                      />
                      {errors.guestPhone && (
                        <p className="text-xs text-rose-600 mt-1">{errors.guestPhone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="special-requests" className="block text-xs font-medium text-stone-700 mb-1">
                      Special Requests (Optional)
                    </label>
                    <input
                      id="special-requests"
                      type="text"
                      placeholder="e.g. High floor quiet room, late check-in (9PM), anniversary stay"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-stone-900 mb-3 uppercase tracking-wider">
                  Payment Method
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-stone-700 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-stone-900">Pay Now by Card</p>
                      <p className="text-[11px] text-stone-500">Instant confirmation</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('property')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                      paymentMethod === 'property'
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-stone-700 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-stone-900">Pay at Property</p>
                      <p className="text-[11px] text-stone-500">Zero charge today</p>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                    <div>
                      <label htmlFor="card-number-input" className="block text-xs font-medium text-stone-700 mb-1">
                        Card Number
                      </label>
                      <input
                        id="card-number-input"
                        type="text"
                        placeholder="4532 8920 1928 3019"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className={`w-full bg-white border ${
                          errors.card ? 'border-rose-500' : 'border-stone-200'
                        } rounded-lg px-3 py-2 text-sm font-mono`}
                      />
                      {errors.card && (
                        <p className="text-xs text-rose-600 mt-1">{errors.card}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="card-expiry-input" className="block text-xs font-medium text-stone-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          id="card-expiry-input"
                          type="text"
                          placeholder="MM / YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label htmlFor="card-cvc-input" className="block text-xs font-medium text-stone-700 mb-1">
                          CVC / CVV
                        </label>
                        <input
                          id="card-cvc-input"
                          type="text"
                          placeholder="CVC"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
                    <strong>Pay upon Check-in:</strong> You will not be charged today. Your room is held with guaranteed reservation. You can settle the full balance at the front desk via card or cash upon arrival.
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 Columns: Price Breakdown & Promo Code */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-5">
                <h3 className="font-serif-luxury text-lg font-semibold text-stone-900 mb-4 pb-3 border-b border-stone-200">
                  Price Breakdown
                </h3>

                {/* Promo Code Input */}
                <div className="mb-4">
                  <label htmlFor="promo-code-input" className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-600" />
                    <span>Have a Promo Code?</span>
                  </label>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-800">
                      <span className="flex items-center gap-1 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span>{appliedPromo.code} (-{appliedPromo.percent}%)</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-stone-500 hover:text-stone-800 underline text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          id="promo-code-input"
                          type="text"
                          placeholder="e.g. AURASTAYS15"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-[11px] text-rose-600 mt-1">{promoError}</p>
                      )}
                      <p className="text-[11px] text-stone-400 mt-1">
                        Tip: Try <span className="font-mono text-stone-600 cursor-pointer underline" onClick={() => setPromoInput('AURASTAYS15')}>AURASTAYS15</span> for 15% off
                      </p>
                    </div>
                  )}
                </div>

                {/* Itemized lines */}
                <div className="space-y-2.5 text-xs text-stone-600 border-t border-stone-200/80 pt-3">
                  <div className="flex justify-between">
                    <span>
                      {formatPrice(room.pricePerNight, currency)} × {nights} {nights === 1 ? 'night' : 'nights'}
                      {roomsCount > 1 ? ` × ${roomsCount} rooms` : ''}
                    </span>
                    <span className="font-mono tabular-nums text-stone-800">
                      {formatPrice(pricing.baseTotal, currency)}
                    </span>
                  </div>

                  {appliedPromo && pricing.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Promo Discount ({appliedPromo.percent}%)</span>
                      <span className="font-mono tabular-nums">
                        -{formatPrice(pricing.discountAmount, currency)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Taxes & Tourism Fees (12%)</span>
                    <span className="font-mono tabular-nums text-stone-800">
                      {formatPrice(pricing.taxAmount, currency)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-sm">
                    <span className="font-semibold text-stone-900">Total Price</span>
                    <span className="font-serif-luxury text-xl font-bold text-stone-900 font-mono tabular-nums">
                      {formatPrice(pricing.grandTotal, currency)}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 text-right">
                    Includes all local taxes and service charges
                  </p>
                </div>
              </div>

              {/* Cancellation Policy and Submit Button */}
              <div className="mt-4 pt-2">
                <div className="flex items-start gap-2 text-[11px] text-stone-500 mb-4 bg-stone-50 p-2.5 rounded-lg border border-stone-200/60">
                  <ShieldAlert className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Flexible Cancellation:</strong> Free cancellation up to 48 hours before check-in. No prepayment fee.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-stone-900 hover:bg-amber-600 disabled:bg-stone-400 text-white font-semibold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Securing Reservation...</span>
                  ) : (
                    <span>
                      Confirm Reservation ({formatPrice(pricing.grandTotal, currency)})
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
