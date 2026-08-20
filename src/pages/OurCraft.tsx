import React from 'react';
import { useNavigate } from 'react-router-dom';

export const OurCraft: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
      {/* Editorial Header */}
      <section className="mb-20 grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
        <div className="md:col-span-7">
          <p className="font-label-caps text-label-caps text-tertiary-container tracking-[0.2em] uppercase mb-4">
            Heritage & Craftsmanship
          </p>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary leading-tight">
            25+ Years of Sartorial Excellence.<br />Savile Row Tradition.
          </h1>
          <p className="font-body-lg text-body-lg text-secondary mt-6 max-w-xl">
            Founded on spatial precision, editorial minimalism, and uncompromising hand construction. Every garment crafted at FANTACY KING is an architectural masterpiece designed specifically for your posture and lifestyle.
          </p>
        </div>

        <div className="md:col-span-5 relative mt-8 md:mt-0">
          <div className="aspect-[4/5] overflow-hidden hairline-border">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXK4VpE0nXPWoNBOJhscnUVc1EGAKuIsEU2IfmdtZslU-EeoVi6I_BkANGkW2y4t1v5EuAzJrY3CnPG8k-t9mue0cpzFVEWKH3_kQmF4bllVB0rZ0hDS4eDCF6WkC43csN_4gnAnC4XdMpT0AIW9M6dNPg0uD0OFEgzahftougnQ-qc-CzgYv3_2My6hbLc1smdY0UKtz5n5igQhVhsuACR38nr2WKDV_bpjjiNOrw8wRLhI0D5WE"
              alt="Atelier interior"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-16 border-t hairline-border grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <span className="font-display-lg text-[48px] text-tertiary-container font-bold">01</span>
          <h3 className="font-headline-md text-[24px] text-primary mt-2 mb-3">Individual Pattern Drafting</h3>
          <p className="font-body-md text-secondary">
            Unlike made-to-measure block altering, every client receives a 100% custom paper pattern drafted manually by our master cutters.
          </p>
        </div>

        <div>
          <span className="font-display-lg text-[48px] text-tertiary-container font-bold">02</span>
          <h3 className="font-headline-md text-[24px] text-primary mt-2 mb-3">Full Floating Canvas</h3>
          <p className="font-body-md text-secondary">
            We utilize floating horsehair canvas interlinings that mold naturally to your body over time, providing lifetime drape and shape retention.
          </p>
        </div>

        <div>
          <span className="font-display-lg text-[48px] text-tertiary-container font-bold">03</span>
          <h3 className="font-headline-md text-[24px] text-primary mt-2 mb-3">Sartorial Hand-Stitching</h3>
          <p className="font-body-md text-secondary">
            From hand-padded lapels and silk buttonholes to functional sleeve surgeon cuffs, hours of hand labor go into every seam.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 bg-surface-container-low p-12 text-center border border-outline-variant">
        <h2 className="font-headline-md text-headline-md text-primary mb-4">Experience the Atelier Firsthand</h2>
        <p className="font-body-lg text-secondary max-w-xl mx-auto mb-8">
          Schedule a private fitting consultation in our flagship salon or request doorstep measuring service.
        </p>
        <button
          onClick={() => navigate('/consultation')}
          className="bg-primary text-on-primary font-label-caps text-label-caps uppercase px-10 py-5 hover:bg-tertiary-container hover:text-primary transition-colors"
        >
          Book Your Fitting Consultation
        </button>
      </section>
    </main>
  );
};
