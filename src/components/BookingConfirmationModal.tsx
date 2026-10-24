import React from 'react';
import { CheckCircle2, Calendar, MapPin, Printer, ArrowRight, QrCode } from 'lucide-react';
import { Booking } from '../types/hotel.ts';
import { formatPrice } from '../utils/bookingLogic.ts';

interface BookingConfirmationModalProps {
  booking: Booking;
  onClose: () => void;
  onViewAllBookings: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  booking,
  onClose,
  onViewAllBookings,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Success Header Banner */}
        <div className="bg-emerald-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-300" />
            </div>
            <p className="text-xs uppercase tracking-widest text-emerald-300 font-medium mb-1">
              Reservation Confirmed
            </p>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-white">
              We look forward to welcoming you!
            </h2>
            <div className="mt-3 bg-emerald-950/80 border border-emerald-700/60 rounded-lg px-3.5 py-1.5 flex items-center gap-2 text-xs font-mono">
              <span className="text-emerald-400">Confirmation Code:</span>
              <strong className="text-white text-sm tracking-wider font-bold">
                {booking.referenceCode}
              </strong>
            </div>
          </div>
        </div>

        {/* Voucher Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Hotel & Room Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
            <div>
              <h3 className="font-serif-luxury text-xl font-semibold text-stone-900">
                {booking.hotelName}
              </h3>
              <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{booking.hotelAddress}</span>
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-xs font-semibold text-stone-800 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-md">
                {booking.roomName}
              </span>
            </div>
          </div>

          {/* Key Stay Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
            <div>
              <span className="text-stone-400 block mb-0.5">Check-in</span>
              <strong className="text-stone-900 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-600" />
                <span>{booking.checkInDate}</span>
              </strong>
              <span className="text-[10px] text-stone-500">From 3:00 PM</span>
            </div>

            <div>
              <span className="text-stone-400 block mb-0.5">Check-out</span>
              <strong className="text-stone-900 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-600" />
                <span>{booking.checkOutDate}</span>
              </strong>
              <span className="text-[10px] text-stone-500">Until 11:00 AM</span>
            </div>

            <div>
              <span className="text-stone-400 block mb-0.5">Duration</span>
              <strong className="text-stone-900 font-medium tabular-nums font-mono block">
                {booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}
              </strong>
              <span className="text-[10px] text-stone-500 block">
                {booking.roomsCount} {booking.roomsCount === 1 ? 'Room' : 'Rooms'}
              </span>
            </div>

            <div>
              <span className="text-stone-400 block mb-0.5">Total Amount</span>
              <strong className="text-stone-900 font-medium font-mono text-sm tabular-nums">
                {formatPrice(booking.grandTotal, booking.currency)}
              </strong>
              <span className="text-[10px] text-emerald-700 font-medium block">
                {booking.paymentMethod === 'card' ? 'Paid via Card' : 'Pay at Property'}
              </span>
            </div>
          </div>

          {/* Guest Information & QR Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-stone-200 rounded-xl">
            <div className="space-y-1 text-xs text-stone-600">
              <p>
                <strong className="text-stone-800">Primary Guest:</strong> {booking.guestName}
              </p>
              <p>
                <strong className="text-stone-800">Confirmation Sent To:</strong> {booking.guestEmail}
              </p>
              <p>
                <strong className="text-stone-800">Phone Contact:</strong> {booking.guestPhone}
              </p>
              {booking.specialRequests && (
                <p>
                  <strong className="text-stone-800">Requests:</strong> {booking.specialRequests}
                </p>
              )}
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex flex-col items-center shrink-0">
              <QrCode className="w-14 h-14 text-stone-800" />
              <span className="text-[10px] text-stone-500 mt-1 font-mono">{booking.referenceCode}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Reservation Voucher</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onViewAllBookings}
                className="w-full sm:w-auto px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium transition-colors"
              >
                View in My Bookings
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 bg-stone-900 hover:bg-amber-600 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Done</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
