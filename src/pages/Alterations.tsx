import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Toast } from '../components/Toast';

export const Alterations: React.FC = () => {
  const navigate = useNavigate();

  const [garmentType, setGarmentType] = useState('Suit Jacket / Blazer');
  const [alterationType, setAlterationType] = useState('Waist & Shoulder Tapering');
  const [requirements, setRequirements] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const garments = [
    'Suit Jacket / Blazer',
    'Trousers / Pants',
    'Evening / Party Dress',
    'Bridal Gown',
    'Shirt / Silk Blouse',
    'Overcoat / Leather Garment',
  ];

  const alterationTypes = [
    'Waist & Shoulder Tapering',
    'Hem Adjustment & Shortening',
    'Sleeve Lengthening / Shortening',
    'Complete Reshaping / Restructuring',
    'Zip / Lining / Button Repair',
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      setReferenceImages((prev) => [...prev, res.url]);
      setToastMessage('Garment photo uploaded successfully');
    } catch (err: any) {
      setToastMessage(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirements.trim() || !name || !email) {
      setToastMessage('Please fill in your name, email, and alteration requirements.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createRequest({
        category: 'Alteration',
        garmentType,
        requirements: `[Type: ${alterationType}] [Preferred Date: ${preferredDate || 'Flexible'}] ${requirements}`,
        referenceImages,
        name,
        email,
        phone,
      });

      setToastMessage(`Alteration Request #${res.request.referenceId} submitted!`);
      setTimeout(() => {
        navigate('/account');
      }, 1500);
    } catch (err: any) {
      setToastMessage(err.message || 'Failed to submit alteration request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      <header className="mb-16 max-w-3xl">
        <p className="font-label-caps text-label-caps text-tertiary-container tracking-widest uppercase mb-2">
          Luxury Garment Restoration & Alterations
        </p>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Restoring Perfection to Your Favorite Pieces.
        </h1>
        <p className="font-body-lg text-body-lg text-secondary mt-4">
          From subtle hem adjustments to complete architectural restructuring, our master tailors handle designer and heritage garments with surgical precision.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 space-y-12">
          {/* Garment Selection */}
          <div className="p-8 border border-outline-variant bg-surface-container-lowest">
            <h3 className="font-label-caps text-label-caps text-primary mb-6 uppercase">1. Select Garment to Alter</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {garments.map((g) => (
                <div
                  key={g}
                  onClick={() => setGarmentType(g)}
                  className={`p-4 border cursor-pointer transition-all ${
                    garmentType === g
                      ? 'border-tertiary-container bg-surface-container-low font-semibold text-primary'
                      : 'border-outline-variant hover:border-primary text-secondary'
                  }`}
                >
                  <p className="font-body-md text-sm">{g}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alteration Type & Requirements */}
          <div className="p-8 border border-outline-variant bg-surface-container-lowest">
            <h3 className="font-label-caps text-label-caps text-primary mb-6 uppercase">2. Alteration Type & Details</h3>
            <div className="space-y-6">
              <div>
                <label className="block font-label-caps text-label-caps text-secondary mb-2 uppercase">Primary Alteration Required</label>
                <select
                  value={alterationType}
                  onChange={(e) => setAlterationType(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary focus:ring-0 focus:border-tertiary-container"
                >
                  {alterationTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-secondary mb-2 uppercase">Explain Alteration Requirement</label>
                <textarea
                  rows={4}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Explain how you would like the garment modified (e.g. taper 1 inch at waist, shorten hem by 2cm, fix shoulder lining)..."
                  className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary focus:ring-0 focus:border-tertiary-container resize-none"
                  required
                />
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-secondary mb-2 uppercase">Preferred Completion / Fitting Date</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary cursor-pointer focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="p-8 border border-outline-variant bg-surface-container-lowest">
            <h3 className="font-label-caps text-label-caps text-primary mb-2 uppercase">3. Attach Garment Photo / Reference</h3>
            <p className="font-caption text-caption text-secondary mb-6">
              Upload a clear photo of the garment or pinned fit area for accurate preliminary pricing.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <label className="cursor-pointer bg-primary text-on-primary px-6 py-3 font-label-caps text-label-caps uppercase hover:bg-tertiary-container hover:text-primary transition-colors">
                {uploading ? 'Uploading...' : 'Upload Garment Photo'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>

              {referenceImages.map((img, idx) => (
                <div key={idx} className="w-16 h-16 relative border border-outline-variant overflow-hidden">
                  <img src={img} alt="Uploaded garment" className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Summary Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 border border-outline-variant bg-surface-container-low sticky top-32 space-y-6">
            <h3 className="font-headline-md text-[20px] text-primary border-b border-outline-variant pb-4 uppercase">
              Submit Alteration Request
            </h3>

            <div>
              <label className="block font-label-caps text-[10px] text-secondary uppercase mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eleanor Vance"
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
                placeholder="vance@example.com"
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
                placeholder="+1 (555) 302-8812"
                className="w-full bg-transparent border-0 border-b border-primary py-1 px-0 font-body-md text-sm text-primary focus:ring-0"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-on-primary font-label-caps text-label-caps uppercase py-4 hover:bg-tertiary-container hover:text-primary transition-colors"
            >
              {submitting ? 'Submitting Request...' : 'Submit Alteration Request'}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};
