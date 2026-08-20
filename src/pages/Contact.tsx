import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../components/Toast';

export const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setToastMessage('Please enter your name, email, and inquiry message.');
      return;
    }
    setToastMessage('Thank you for contacting FANTACY KING. Our concierge will get back to you shortly.');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      <header className="mb-16 max-w-3xl">
        <p className="font-label-caps text-label-caps text-tertiary-container tracking-widest uppercase mb-2">
          Atelier Concierge
        </p>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Contact FANTACY KING.
        </h1>
        <p className="font-body-lg text-body-lg text-secondary mt-4">
          Have an inquiry regarding bespoke tailoring, bridal commissions, or doorstep appointments? Get in touch with our private styling team.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 p-8 border border-outline-variant bg-surface-container-lowest">
          <h3 className="font-headline-md text-[24px] text-primary mb-6 uppercase">Send an Inquiry</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-label-caps text-label-caps text-secondary uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alexander Sterling"
                className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary focus:ring-0 focus:border-tertiary-container"
                required
              />
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-secondary uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sterling@example.com"
                className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary focus:ring-0 focus:border-tertiary-container"
                required
              />
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-secondary uppercase mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary focus:ring-0 focus:border-tertiary-container"
              />
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-secondary uppercase mb-1">Message / Questions</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can our master tailors assist you today?"
                className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary focus:ring-0 focus:border-tertiary-container resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-on-primary font-label-caps text-label-caps uppercase px-10 py-4 hover:bg-tertiary-container hover:text-primary transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right Column: Atelier Locations & Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 border border-outline-variant bg-surface-container-low space-y-8">
            <div>
              <h4 className="font-label-caps text-label-caps text-tertiary-container uppercase tracking-widest mb-2">Flagship Atelier</h4>
              <p className="font-headline-md text-[20px] text-primary">Savile Row Salon</p>
              <p className="font-body-md text-secondary mt-2">
                14 Savile Row, Mayfair<br />
                London W1S 3JN, United Kingdom
              </p>
              <p className="font-caption text-caption text-secondary mt-1">By Appointment Only</p>
            </div>

            <div className="pt-6 border-t border-outline-variant">
              <h4 className="font-label-caps text-label-caps text-secondary uppercase mb-2">Direct Contact</h4>
              <p className="font-body-md text-primary">Concierge: +44 (0) 20 7946 0912</p>
              <p className="font-body-md text-primary">Email: atelier@threadandstyle.com</p>
            </div>

            <div className="pt-6 border-t border-outline-variant">
              <h4 className="font-label-caps text-label-caps text-secondary uppercase mb-3">Instant Consultation</h4>
              <button
                onClick={() => navigate('/consultation')}
                className="w-full bg-transparent border hairline-border text-primary font-label-caps text-label-caps uppercase py-3 hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                Book Private Consultation
              </button>

              <a
                href="https://wa.me/442079460912"
                target="_blank"
                rel="noreferrer"
                className="mt-3 w-full bg-transparent border hairline-border-gold text-tertiary-container font-label-caps text-label-caps uppercase py-3 hover:bg-tertiary-container hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                WhatsApp Styling Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
