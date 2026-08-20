import React from 'react';
import { useNavigate } from 'react-router-dom';

export const MensServices: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Bespoke 3-Piece & 2-Piece Suits',
      desc: 'Engineered pattern drafting, floating full-canvas construction, hand-pick stitching, and Italian/English wools.',
      price: 'From $1,200',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPo95bZLCT8FfKIJSlDptBzD7Cw0zt-y5gj9G0p7qxClsbXE12se5f6BF-z5RsWPcZ547xaZVY7Cuz9B_GenP--H1wzvr_ghnY5IFwPdIt-jI0nCfe1n9bI1MlsCfHXLkq4Ak4rfcN1cwAds-MFjH3x2yszB2Vr_1ONaeb1Q8JNFQMKrGHWufkC4Bp2ycucw5O9SeWO6MIXBfyUqfezIPIWIwatG5fdmleIh5YtLOljd5xXdC5z_4',
    },
    {
      title: 'Blazers & Sport Coats',
      desc: 'Structured and unconstructed tailored coats in cashmere, tweed, hopsack, and linen blends for smart casual elegance.',
      price: 'From $850',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0J4lLPNeUq9zEDrVWjmlDFw-tvGnvfcH9ZORpKcDKY2dOfz8L_fHFSJ2qZZoUr7fx0NCueRNQpZz3XgYXK8win2o-olBY_0q2IBoK34kF0NGCgRTbCGojTYIDhW9JL8qOQe5n37_vboECI-DnuP6LInBz0PCEBxuqJHOmgwWJhZN9ZMPY4UR9UEldPHeVN5ua13_CUjTX5SO3HwUvGUwvCGtzKszz76JQmaKMXFMHrn4FVFPi7Uo',
    },
    {
      title: 'Bespoke Trousers & Chinos',
      desc: 'Custom waist rise, side adjusters, extended waistband tabs, double or single pleats, tailored to your posture.',
      price: 'From $350',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAVgt2nNxfJdHqZInVW8rSj7YNDPVE5HzioHIblQNq2rS1vhEcnEE8EIrYQQLupn5kgB95GMNNsxQVqs-Ijrh2L5Apm3UFQmJ3J5irwvMPPVcbeGuRgsh5ifs9TPdzqxcrBSzHlMTElQR7_CMvRKoJ7kU13NkScfJvp-IrB6HZKVb74R__90pai_4peuZpZbdK9D96dbHEGkTtXAd8d3e6ccebuxoPoHAfQERm3TyL_QzGo274NNQ',
    },
    {
      title: 'Custom Dress Shirts & Tuxedo Shirts',
      desc: '100% Egyptian Giza cottons, mother-of-pearl buttons, custom collar spreads, cuff styles, and monogramming.',
      price: 'From $220',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAygpPL7V9NEcnssLApgW5xzDm6HDdQltaD26SVEautn6VTNuon7FvkFkaDU9R9hcUv5Wv6EHu33NbMdXBCyIz0mU7gQgSrnOQqzGVYne3VYBmHVaU1x7CqoUR40JFjR3JL5-82DUiULNfcb8QLe51g7l0nJ-nhZwRkBGKOQDKQwpblyA3sZLKdylY0PNi5TWE9yluzj_aPNKnan4V4hhijTX1BT5aIUpxxO3dcEXkqgK3TzX1SXiM',
    },
    {
      title: 'Traditional Wear & Sherwanis',
      desc: 'Hand-embroidered bespoke Sherwanis, Bandhgalas, Kurta sets, and Nehru jackets crafted with royal elegance.',
      price: 'From $950',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0gEgASp8VD3KClbV0Y9ghm-DMAhyICdxYerMujfCyhdqx5DgBc8bsqk_Cyp1MB7XRcLD8kxoRj_eak62Iex4ujaFBvCdodJdElwQ8tPNEhZlobn81JiPiRmxVVDXlvsi9G50FROPuFwMmbdvOFjvMVhqGM_vVyWaftk_4fHXlsAmX5oeggHawTx9OimUzjvKWeCM0q-cfI6XFW6Q212RrhN9UXKtkiDsnV-H_WEtoXny6TSECWF0',
    },
  ];

  return (
    <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
      <header className="mb-16 max-w-3xl">
        <p className="font-label-caps text-label-caps text-tertiary-container tracking-widest uppercase mb-2">
          Men's Sartorial Collection
        </p>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Bespoke Men's Tailoring.
        </h1>
        <p className="font-body-lg text-body-lg text-secondary mt-4">
          Savile Row heritage meets modern minimalist design. Explore our bespoke services crafted exclusively for men.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {services.map((item, idx) => (
          <div key={idx} className="group border border-outline-variant p-6 flex flex-col justify-between hover:border-primary transition-colors bg-surface-container-lowest">
            <div>
              <div className="aspect-[4/3] overflow-hidden mb-6 hairline-border">
                <img src={item.image} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="font-label-caps text-[10px] text-tertiary-container uppercase tracking-widest">{item.price}</p>
              <h3 className="font-headline-md text-[22px] text-primary mt-1 mb-3">{item.title}</h3>
              <p className="font-body-md text-sm text-secondary">{item.desc}</p>
            </div>

            <div className="mt-8 pt-4 border-t border-outline-variant flex justify-between items-center">
              <button
                onClick={() => navigate('/bespoke')}
                className="font-label-caps text-label-caps text-primary border-b border-primary hover:border-tertiary-container transition-colors uppercase"
              >
                Customize Service
              </button>
              <span className="material-symbols-outlined text-secondary group-hover:text-tertiary-container">arrow_forward</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
