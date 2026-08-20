import React, { useState } from 'react';
import { api } from '../services/api';
import { Consultation as ConsultationType } from '../types';
import { Toast } from '../components/Toast';

export const Consultation: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Bespoke 3-Piece Suit Consultation');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('14:00 - 15:30');
  const [location, setLocation] = useState('London Flagship Atelier');
  const [requirements, setRequirements] = useState('');

  const [booking, setBooking] = useState<ConsultationType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const availableServices = [
    'Bespoke 3-Piece Suit Consultation',
    'Luxury Alterations & Fitting',
    'Bridal Couture & Gown Consultation',
    'Doorstep Master Fitting Service',
    'Personal Wardrobe & Styling',
  ];

  const timeSlots = [
    '10:00 - 11:30',
    '12:00 - 13:30',
    '14:00 - 15:30',
    '16:00 - 17:30',
    '18:00 - 19:30',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !email || !date || !time) {
      setToastMessage('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createConsultation({
        customerName,
        email,
        phone,
        service,
        date,
        time,
        location,
        requirements,
      });

      setBooking(res.consultation);
      setToastMessage(`Consultation confirmed! Reference ID: ${res.consultation.referenceId}`);
    } catch (err: any) {
      setToastMessage(err.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (booking) {
    return (
      <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
        <div className="max-w-2xl mx-auto p-12 border border-tertiary-container bg-surface-container-lowest text-center space-y-6">
          <div className="w-16 h-16 bg-primary text-tertiary-container rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">check</span>
          </div>

          <p className="font-label-caps text-label-caps text-tertiary-container tracking-widest uppercase">
            Consultation Confirmed
          </p>

          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile text-primary">
            We Look Forward to Welcoming You.
          </h1>

          <div className="p-6 bg-surface-container-low border border-outline-variant text-left space-y-3 font-body-md text-sm">
            <div className="flex justify-between border-b border-outline-variant pb-2">
              <span className="text-secondary font-label-caps text-xs">Reference ID</span>
              <span className="font-bold text-primary font-mono">{booking.referenceId}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant pb-2">
              <span className="text-secondary font-label-caps text-xs">Client Name</span>
              <span className="text-primary font-semibold">{booking.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant pb-2">
              <span className="text-secondary font-label-caps text-xs">Service</span>
              <span className="text-primary">{booking.service}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant pb-2">
              <span className="text-secondary font-label-caps text-xs">Date & Time</span>
              <span className="text-primary font-semibold">{booking.date} @ {booking.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary font-label-caps text-xs">Location</span>
              <span className="text-primary">{booking.location}</span>
            </div>
          </div>

          <p className="font-caption text-caption text-secondary">
            A confirmation email with calendar invitation has been sent to {booking.email}.
          </p>

          <div className="pt-4 flex gap-4 justify-center">
            <button
              onClick={() => setBooking(null)}
              className="bg-primary text-on-primary font-label-caps text-label-caps uppercase px-8 py-3 hover:bg-tertiary-container hover:text-primary transition-colors"
            >
              Book Another Session
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      <header className="mb-16 max-w-3xl">
        <p className="font-label-caps text-label-caps text-tertiary-container tracking-widest uppercase mb-2">
          Private Fitting Appointment
        </p>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Schedule a Private Consultation.
        </h1>
        <p className="font-body-lg text-body-lg text-secondary mt-4">
          Reserve a dedicated session with our master tailoring team to review swatches, take measurements, or discuss bespoke alterations.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Booking Form */}
        <div className="lg:col-span-8 space-y-12">
          {/* Service Selection */}
          <div className="p-8 border border-outline-variant bg-surface-container-lowest">
            <h3 className="font-label-caps text-label-caps text-primary mb-4 uppercase">1. Select Fitting Service</h3>
            <div className="space-y-3">
              {availableServices.map((s) => (
                <div
                  key={s}
                  onClick={() => setService(s)}
                  className={`p-4 border cursor-pointer transition-all ${
                    service === s
                      ? 'border-tertiary-container bg-surface-container-low font-semibold text-primary'
                      : 'border-outline-variant hover:border-primary text-secondary'
                  }`}
                >
                  <p className="font-body-md text-sm">{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Time Selection */}
          <div className="p-8 border border-outline-variant bg-surface-container-lowest">
            <h3 className="font-label-caps text-label-caps text-primary mb-6 uppercase">2. Select Preferred Date & Time</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block font-label-caps text-label-caps text-secondary mb-2 uppercase">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary cursor-pointer focus:ring-0"
                  required
                />
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-secondary mb-2 uppercase">Time Slot</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary cursor-pointer focus:ring-0 focus:border-tertiary-container"
                >
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8">
              <label className="block font-label-caps text-label-caps text-secondary mb-2 uppercase">Location / Preference</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setLocation('London Flagship Atelier')}
                  className={`px-6 py-3 font-label-caps text-label-caps uppercase ${
                    location === 'London Flagship Atelier'
                      ? 'bg-primary text-on-primary'
                      : 'bg-transparent border hairline-border text-primary'
                  }`}
                >
                  Atelier Salon
                </button>
                <button
                  type="button"
                  onClick={() => setLocation('Doorstep Service (At Home / Office)')}
                  className={`px-6 py-3 font-label-caps text-label-caps uppercase ${
                    location.includes('Doorstep')
                      ? 'bg-primary text-on-primary'
                      : 'bg-transparent border hairline-border text-primary'
                  }`}
                >
                  Doorstep Visit
                </button>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="p-8 border border-outline-variant bg-surface-container-lowest">
            <h3 className="font-label-caps text-label-caps text-primary mb-4 uppercase">3. Special Notes or Garment Details</h3>
            <textarea
              rows={3}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Tell us what you plan to bring or discuss during your consultation..."
              className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary focus:ring-0 resize-none"
            />
          </div>
        </div>

        {/* Right Column: Customer Details */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 border border-outline-variant bg-surface-container-low sticky top-32 space-y-6">
            <h3 className="font-headline-md text-[20px] text-primary border-b border-outline-variant pb-4 uppercase">
              Client Information
            </h3>

            <div>
              <label className="block font-label-caps text-[10px] text-secondary uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Alexander Sterling"
                className="w-full bg-transparent border-0 border-b border-primary py-1 px-0 font-body-md text-sm text-primary focus:ring-0"
                required
              />
            </div>

            <div>
              <label className="block font-label-caps text-[10px] text-secondary uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sterling@example.com"
                className="w-full bg-transparent border-0 border-b border-primary py-1 px-0 font-body-md text-sm text-primary focus:ring-0"
                required
              />
            </div>

            <div>
              <label className="block font-label-caps text-[10px] text-secondary uppercase mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full bg-transparent border-0 border-b border-primary py-1 px-0 font-body-md text-sm text-primary focus:ring-0"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-on-primary font-label-caps text-label-caps uppercase py-4 hover:bg-tertiary-container hover:text-primary transition-colors"
            >
              {submitting ? 'Confirming Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};
