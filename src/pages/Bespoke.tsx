import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Toast } from '../components/Toast';

export const Bespoke: React.FC = () => {
  const navigate = useNavigate();

  const [gender, setGender] = useState<'Men' | 'Women'>('Men');
  const [garmentType, setGarmentType] = useState('3-Piece Bespoke Suit');
  const [fabricPreference, setFabricPreference] = useState('Italian Wool & Flannel');
  const [requirements, setRequirements] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [chest, setChest] = useState('40.5"');
  const [waist, setWaist] = useState('34.0"');
  const [shoulder, setShoulder] = useState('18.5"');
  const [sleeve, setSleeve] = useState('25.0"');

  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const menGarments = [
    '3-Piece Bespoke Suit',
    'Bespoke Blazer / Jacket',
    'Tuxedo / Dinner Suit',
    'Bespoke Trousers',
    'Custom Dress Shirt',
    'Traditional Sherwani / Kurta',
  ];

  const womenGarments = [
    'Bespoke Suit & Pantsuit',
    'Custom Evening Gown',
    'Bridal Gown',
    'Silk Blouse / Saree Blouse',
    'Tailored Salwar / Kurta',
    'Custom Coat / Cape',
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      setReferenceImages((prev) => [...prev, res.url]);
      setToastMessage('Reference image uploaded successfully');
    } catch (err: any) {
      setToastMessage(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirements.trim() || !name || !email) {
      setToastMessage('Please enter your name, email, and tailoring requirements.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createRequest({
        category: 'Bespoke',
        gender,
        garmentType,
        requirements: `[Fabric: ${fabricPreference}] ${requirements}`,
        measurements: { chest, waist, shoulder, sleeveLength: sleeve },
        referenceImages,
        name,
        email,
        phone,
      });

      setToastMessage(`Request #${res.request.referenceId} submitted! Redirecting to account...`);
      setTimeout(() => {
        navigate('/account');
      }, 1500);
    } catch (err: any) {
      setToastMessage(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      <header className="mb-16 max-w-3xl">
        <p className="font-label-caps text-label-caps text-tertiary-container tracking-widest uppercase mb-2">
          Bespoke Tailoring Journey
        </p>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Engineered to Your Silhouette.
        </h1>
        <p className="font-body-lg text-body-lg text-secondary mt-4">
          Select your preferences below to initiate a bespoke commission with our Savile Row master tailors.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-8 space-y-12">
          {/* Step 1: Gender & Garment Selection */}
          <div className="p-8 border border-outline-variant bg-surface-container-lowest">
            <h3 className="font-label-caps text-label-caps text-primary mb-6 uppercase flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-[10px] flex items-center justify-center font-mono">1</span>
              Gender & Garment Category
            </h3>

            <div className="flex gap-4 mb-8">
              <button
                type="button"
                onClick={() => {
                  setGender('Men');
                  setGarmentType(menGarments[0]);
                }}
                className={`px-8 py-3 font-label-caps text-label-caps uppercase transition-colors ${
                  gender === 'Men'
                    ? 'bg-primary text-on-primary'
                    : 'bg-transparent border hairline-border text-primary hover:bg-surface-container'
                }`}
              >
                Men's Tailoring
              </button>
              <button
                type="button"
                onClick={() => {
                  setGender('Women');
                  setGarmentType(womenGarments[0]);
                }}
                className={`px-8 py-3 font-label-caps text-label-caps uppercase transition-colors ${
                  gender === 'Women'
                    ? 'bg-primary text-on-primary'
                    : 'bg-transparent border hairline-border text-primary hover:bg-surface-container'
                }`}
              >
                Women's Tailoring
              </button>
            </div>

            <label className="block font-label-caps text-label-caps text-secondary mb-3 uppercase">Select Garment</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(gender === 'Men' ? menGarments : womenGarments).map((g) => (
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

          {/* Step 2: Customization & Requirements */}
          <div className="p-8 border border-outline-variant bg-surface-container-lowest">
            <h3 className="font-label-caps text-label-caps text-primary mb-6 uppercase flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-[10px] flex items-center justify-center font-mono">2</span>
              Fabric & Custom Requirements
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block font-label-caps text-label-caps text-secondary mb-2 uppercase">Preferred Fabric & Mill</label>
                <select
                  value={fabricPreference}
                  onChange={(e) => setFabricPreference(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary focus:ring-0 focus:border-tertiary-container"
                >
                  <option value="Italian Wool & Flannel">Italian Wool & Flannel (Loro Piana / Zegna)</option>
                  <option value="English Tweed & Worsted">English Tweed & Worsted (Scabal / Dormeuil)</option>
                  <option value="Pure Silk & Velvet">Pure Silk & Velvet Couture</option>
                  <option value="Linen & Cotton Blend">Lightweight Linen & Fine Cotton</option>
                  <option value="Tailor Recommendation">Tailor's Choice (Discuss during consultation)</option>
                </select>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-secondary mb-2 uppercase">Detailed Requirements / Vision</label>
                <textarea
                  rows={4}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Describe your desired lapel style, lining, buttons, fit preferences, or occasion dates..."
                  className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary focus:ring-0 focus:border-tertiary-container resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Step 3: Reference Image Upload */}
          <div className="p-8 border border-outline-variant bg-surface-container-lowest">
            <h3 className="font-label-caps text-label-caps text-primary mb-4 uppercase flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-[10px] flex items-center justify-center font-mono">3</span>
              Reference Photos & Inspiration (Optional)
            </h3>
            <p className="font-caption text-caption text-secondary mb-6">
              Upload photos of suits, dresses, or style inspirations you love.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <label className="cursor-pointer bg-primary text-on-primary px-6 py-3 font-label-caps text-label-caps uppercase hover:bg-tertiary-container hover:text-primary transition-colors">
                {uploading ? 'Uploading...' : 'Choose Reference Image'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>

              {referenceImages.map((img, idx) => (
                <div key={idx} className="w-16 h-16 relative border border-outline-variant overflow-hidden">
                  <img src={img} alt="Uploaded reference" className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Measurements & Contact Summary */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 border border-outline-variant bg-surface-container-low sticky top-32 space-y-6">
            <h3 className="font-headline-md text-[20px] text-primary border-b border-outline-variant pb-4 uppercase">
              Client & Measurements
            </h3>

            <div>
              <label className="block font-label-caps text-[10px] text-secondary uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              />
            </div>

            <div className="pt-4 border-t border-outline-variant">
              <p className="font-label-caps text-label-caps text-secondary mb-3 uppercase">Quick Measurements</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-caption text-caption text-secondary block">Chest / Bust</span>
                  <input
                    type="text"
                    value={chest}
                    onChange={(e) => setChest(e.target.value)}
                    className="w-full bg-transparent border-b border-outline py-1 text-sm font-semibold"
                  />
                </div>
                <div>
                  <span className="font-caption text-caption text-secondary block">Waist</span>
                  <input
                    type="text"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="w-full bg-transparent border-b border-outline py-1 text-sm font-semibold"
                  />
                </div>
                <div>
                  <span className="font-caption text-caption text-secondary block">Shoulder</span>
                  <input
                    type="text"
                    value={shoulder}
                    onChange={(e) => setShoulder(e.target.value)}
                    className="w-full bg-transparent border-b border-outline py-1 text-sm font-semibold"
                  />
                </div>
                <div>
                  <span className="font-caption text-caption text-secondary block">Sleeve</span>
                  <input
                    type="text"
                    value={sleeve}
                    onChange={(e) => setSleeve(e.target.value)}
                    className="w-full bg-transparent border-b border-outline py-1 text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-on-primary font-label-caps text-label-caps uppercase py-4 hover:bg-tertiary-container hover:text-primary transition-colors"
            >
              {submitting ? 'Submitting Request...' : 'Submit Bespoke Request'}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};
