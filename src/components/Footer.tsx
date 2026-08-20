import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-inverse-surface dark:bg-surface-container-lowest border-t border-on-secondary-fixed-variant dark:border-outline-variant w-full text-inverse-on-surface">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-16 w-full max-w-container-max mx-auto">
        {/* Brand Column */}
        <div className="md:col-span-1">
          <span className="font-display-lg text-headline-md text-inverse-on-surface mb-6 block uppercase tracking-tighter">
            FANTACY KING
          </span>
          <p className="font-caption text-caption text-secondary">
            © 2026 FANTACY KING. ALL RIGHTS RESERVED.
          </p>
          <p className="font-caption text-caption text-secondary mt-2">
            Savile Row Quality • Bespoke Tailoring • Luxury Alterations
          </p>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-label-caps text-inverse-on-surface uppercase mb-2">Company</h4>
          <Link to="/craft" className="font-body-md text-body-md text-secondary-fixed-dim hover:text-tertiary-fixed transition-colors duration-200">
            Our Atelier & Story
          </Link>
          <Link to="/craft" className="font-body-md text-body-md text-secondary-fixed-dim hover:text-tertiary-fixed transition-colors duration-200">
            Savile Row Heritage
          </Link>
          <Link to="/contact" className="font-body-md text-body-md text-secondary-fixed-dim hover:text-tertiary-fixed transition-colors duration-200">
            Contact Atelier
          </Link>
        </div>

        {/* Services Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-label-caps text-inverse-on-surface uppercase mb-2">Services</h4>
          <Link to="/bespoke" className="font-body-md text-body-md text-secondary-fixed-dim hover:text-tertiary-fixed transition-colors duration-200">
            Bespoke Suits & Blazers
          </Link>
          <Link to="/alterations" className="font-body-md text-body-md text-secondary-fixed-dim hover:text-tertiary-fixed transition-colors duration-200">
            Luxury Alterations
          </Link>
          <Link to="/women" className="font-body-md text-body-md text-secondary-fixed-dim hover:text-tertiary-fixed transition-colors duration-200">
            Bespoke Bridal Couture
          </Link>
          <Link to="/consultation" className="font-body-md text-body-md text-secondary-fixed-dim hover:text-tertiary-fixed transition-colors duration-200">
            Doorstep Consultation
          </Link>
        </div>

        {/* Legal & Account */}
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-label-caps text-inverse-on-surface uppercase mb-2">Account & Access</h4>
          <Link to="/account" className="font-body-md text-body-md text-secondary-fixed-dim hover:text-tertiary-fixed transition-colors duration-200">
            My Dashboard
          </Link>
          <Link to="/login" className="font-body-md text-body-md text-secondary-fixed-dim hover:text-tertiary-fixed transition-colors duration-200">
            Client Portal Login
          </Link>
          <Link to="/admin" className="font-body-md text-body-md text-secondary-fixed-dim hover:text-tertiary-fixed transition-colors duration-200">
            Admin Management
          </Link>
        </div>
      </div>
    </footer>
  );
};
