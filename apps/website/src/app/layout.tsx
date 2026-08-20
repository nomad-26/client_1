import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/Header";

export const metadata: Metadata = {
  title: "FANTACY KING - Bespoke Tailoring",
  description: "Bespoke Luxury Tailoring at your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface antialiased selection:bg-tertiary-container selection:text-on-tertiary-container flex flex-col min-h-screen">
        {/* Interactive Responsive Header */}
        <Header />

        <main className="flex-grow pt-[80px]">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-inverse-surface dark:bg-surface-container-lowest border-t border-on-secondary-fixed-variant dark:border-outline-variant w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-16 w-full max-w-container-max mx-auto">
            <div className="md:col-span-1">
              <span className="font-display-lg text-[32px] text-inverse-on-surface dark:text-on-surface mb-8 block uppercase">
                FANTACY KING
              </span>
              <p className="font-caption text-[11px] text-secondary">
                © 2024 FANTACY KING. ALL RIGHTS RESERVED.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-label-caps text-[12px] font-semibold tracking-[0.15em] text-inverse-on-surface dark:text-on-surface uppercase mb-2">Company</h4>
              <a className="font-body-md text-[16px] text-secondary-fixed-dim dark:text-secondary hover:text-tertiary-fixed dark:hover:text-tertiary transition-colors duration-200" href="#about">About Us</a>
              <a className="font-body-md text-[16px] text-secondary-fixed-dim dark:text-secondary hover:text-tertiary-fixed dark:hover:text-tertiary transition-colors duration-200" href="#work">Our Work</a>
              <a className="font-body-md text-[16px] text-secondary-fixed-dim dark:text-secondary hover:text-tertiary-fixed dark:hover:text-tertiary transition-colors duration-200" href="#reviews">Reviews</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-label-caps text-[12px] font-semibold tracking-[0.15em] text-inverse-on-surface dark:text-on-surface uppercase mb-2">Services</h4>
              <a className="font-body-md text-[16px] text-secondary-fixed-dim dark:text-secondary hover:text-tertiary-fixed dark:hover:text-tertiary transition-colors duration-200" href="#services">Bespoke Tailoring</a>
              <a className="font-body-md text-[16px] text-secondary-fixed-dim dark:text-secondary hover:text-tertiary-fixed dark:hover:text-tertiary transition-colors duration-200" href="#services">Alterations</a>
              <a className="font-body-md text-[16px] text-secondary-fixed-dim dark:text-secondary hover:text-tertiary-fixed dark:hover:text-tertiary transition-colors duration-200" href="#services">Bridal</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-label-caps text-[12px] font-semibold tracking-[0.15em] text-inverse-on-surface dark:text-on-surface uppercase mb-2">Contact & Legal</h4>
              <a className="font-body-md text-[16px] text-secondary-fixed-dim dark:text-secondary hover:text-tertiary-fixed dark:hover:text-tertiary transition-colors duration-200" href="#contact">Contact Us</a>
              <a className="font-body-md text-[16px] text-secondary-fixed-dim dark:text-secondary hover:text-tertiary-fixed dark:hover:text-tertiary transition-colors duration-200" href="#contact">Privacy Policy</a>
              <a className="font-body-md text-[16px] text-secondary-fixed-dim dark:text-secondary hover:text-tertiary-fixed dark:hover:text-tertiary transition-colors duration-200" href="#contact">Terms of Service</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
