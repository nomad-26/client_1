import React from 'react';
import { useNavigate } from 'react-router-dom';

export const WomensServices: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Bespoke Bridal Couture & Gowns',
      desc: 'Hand-sewn bridal gowns, intricate zardozi/bead embroidery, silk organza layering, and custom veil design.',
      price: 'From $1,800',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA39UQCw73UVOrQVQW0pLXY5MIN6nqJvW0gc8MUTdhZzNHuoQEyLQPM2832Qrg0z-OnhjeImAJg4tLZnqyKwWTPc9m_4kk9j165KXJf-81axo3s7tkmkH9y_ycECRsLRW_IJDO9WcZ2LNPs8DpTSa945f01RrDIkrEqMwz6gu-xVyOqj94CjOvdld1bLxP-97CRVoo-SJGa-wLH-M-yC0ZQiOq2hw7fFuOQS_aq2FueUJdz5VFaQH0',
    },
    {
      title: 'Women’s Tailored Power Suits & Blazers',
      desc: 'Precision women’s jacket patterns, waist definition, peak lapels, tailored trousers, and silk lining.',
      price: 'From $1,100',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPo95bZLCT8FfKIJSlDptBzD7Cw0zt-y5gj9G0p7qxClsbXE12se5f6BF-z5RsWPcZ547xaZVY7Cuz9B_GenP--H1wzvr_ghnY5IFwPdIt-jI0nCfe1n9bI1MlsCfHXLkq4Ak4rfcN1cwAds-MFjH3x2yszB2Vr_1ONaeb1Q8JNFQMKrGHWufkC4Bp2ycucw5O9SeWO6MIXBfyUqfezIPIWIwatG5fdmleIh5YtLOljd5xXdC5z_4',
    },
    {
      title: 'Designer Evening Dresses & Ballgowns',
      desc: 'Custom red carpet eveningwear, corset structuring, drape work, and high-fashion editorial styling.',
      price: 'From $1,400',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjq_7_sxFZoHVMLvL6PAUy2uSK3RbggjB33-loaqUasITC1RRzxr2qoSYMRm6zgTdCm3xrL3II_rRDAv3IB_byWSxNM5Oghavf_wUG2PTyX0rwqZm6hyQnQ5imjnvkmM8ZWvj35n6CzUeNSYm4EOVp7leG9PDCoq9tTfbq9ibJnf0LcrJcAqWiBnZQkKqcTDz70guJTP3LGFg9Vi0-AxgNs6fNqB8Jik1rhRIc_s3DLJKx-90lN8w',
    },
    {
      title: 'Bespoke Saree Blouses & Ethnic Wear',
      desc: 'Precision fit padded saree blouses, lehenga cholis, Anarkali gowns, and handcrafted necklines.',
      price: 'From $250',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAygpPL7V9NEcnssLApgW5xzDm6HDdQltaD26SVEautn6VTNuon7FvkFkaDU9R9hcUv5Wv6EHu33NbMdXBCyIz0mU7gQgSrnOQqzGVYne3VYBmHVaU1x7CqoUR40JFjR3JL5-82DUiULNfcb8QLe51g7l0nJ-nhZwRkBGKOQDKQwpblyA3sZLKdylY0PNi5TWE9yluzj_aPNKnan4V4hhijTX1BT5aIUpxxO3dcEXkqgK3TzX1SXiM',
    },
    {
      title: 'Luxury Alterations & Reshaping',
      desc: 'Haute couture alterations for designer gowns, delicate silk hem adjustments, and corset recalibration.',
      price: 'From $120',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXmlnlCQSTOQorBEvIzbl0ZM_ypc3uF7rkU9mplr3QFKveRLD54TBl84kTaT0SzcVAqSpJKv9NYDgmoBXHW_2RfC294tNk6CUJR9NkHO-xIejpDOVh98-w4p4OnjU8hsqIZzWRVJfy2phWeDKOug9XU4gVPUY2KeLzhPDptRCdjf94h7VZ1qiCjnEIz_p-v9GDr1j1-rV2QOpuM5FEVDqSpIFGwNOQ3h8hQ_LNQF3jVnRBNwrFUKo',
    },
  ];

  return (
    <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
      <header className="mb-16 max-w-3xl">
        <p className="font-label-caps text-label-caps text-tertiary-container tracking-widest uppercase mb-2">
          Women's Couture & Tailoring
        </p>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Bespoke Women's Tailoring.
        </h1>
        <p className="font-body-lg text-body-lg text-secondary mt-4">
          Architected silhouettes for women. From sharp power suits to ethereal bespoke bridal couture.
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
