import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-grow pt-[80px]">
      {/* 1. HERO: Editorial Split */}
      <section className="relative w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-[64px] md:py-[128px] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          {/* Left Content */}
          <div className="md:col-span-5 md:pr-12 z-10 flex flex-col gap-6">
            <p className="font-label-caps text-label-caps text-tertiary-container tracking-[0.2em] uppercase">
              Precision Bespoke Tailoring
            </p>
            <h1 className="font-display-lg text-[48px] md:text-display-lg text-primary leading-tight">
              Crafted for You.<br />Defined by Precision.
            </h1>
            <p className="font-body-lg text-body-lg text-secondary mt-4 max-w-md">
              25+ Years of Master Tailoring. Experience the pinnacle of sartorial elegance with garments engineered to your exact specifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => navigate('/consultation')}
                className="bg-primary text-on-primary font-label-caps text-label-caps uppercase px-8 py-4 hover:bg-tertiary-container hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                Book a Consultation
              </button>
              <button
                onClick={() => navigate('/bespoke')}
                className="bg-transparent border hairline-border text-primary font-label-caps text-label-caps uppercase px-8 py-4 hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
              >
                Explore Bespoke
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:col-span-7 relative mt-12 md:mt-0 offset-image-right">
            <div className="aspect-[4/5] md:aspect-[3/4] w-full overflow-hidden relative">
              <div
                className="bg-cover bg-center w-full h-full absolute inset-0"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAp0SVwz5SCysNR_ML2C94Xob_y09NpuqtIJR3EPl7naKgLUpFa9OZsg1YphJp3ykWnh0TmhIcZoSX4-q0VzPYBEoCjO4mjklm0YG0plbWter27_7Xtr1mwtmvJW_s0BhmUX1QvrAj1a--GEYTfnWzQztSrC3foHxysECf2RdlbpeRZ2kIXlLGMDql1ZcRu-aY80_55iqGE4xreKLkySoYRAK5b_znS2zKr20Om9wERVAI060q_DHc')",
                }}
              ></div>
            </div>
            {/* Decorative subtle accent */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 border-l border-b hairline-border-gold hidden md:block z-0"></div>
          </div>
        </div>

        {/* Credibility Banner */}
        <div className="mt-24 md:mt-32 pt-12 border-t hairline-border grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2">
            <span className="material-symbols-outlined text-tertiary-container text-[24px]">straighten</span>
            <h3 className="font-label-caps text-label-caps uppercase text-primary">Perfect Fit Guarantee</h3>
            <p className="font-caption text-caption text-secondary">Engineered to your exact measurements.</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="material-symbols-outlined text-tertiary-container text-[24px]">diamond</span>
            <h3 className="font-label-caps text-label-caps uppercase text-primary">Premium Craftsmanship</h3>
            <p className="font-caption text-caption text-secondary">The finest fabrics sourced globally.</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="material-symbols-outlined text-tertiary-container text-[24px]">person_check</span>
            <h3 className="font-label-caps text-label-caps uppercase text-primary">Personalized Service</h3>
            <p className="font-caption text-caption text-secondary">A dedicated styling consultant for you.</p>
          </div>
        </div>
      </section>

      {/* 2. MASTER TAILOR STORY */}
      <section className="bg-surface-container-low py-[128px]">
        <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            {/* Left Image (breaks grid) */}
            <div className="md:col-span-6 lg:col-span-5 md:-ml-margin-desktop mb-12 md:mb-0">
              <div
                className="bg-cover bg-center w-full aspect-[4/3] md:aspect-square"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAXK4VpE0nXPWoNBOJhscnUVc1EGAKuIsEU2IfmdtZslU-EeoVi6I_BkANGkW2y4t1v5EuAzJrY3CnPG8k-t9mue0cpzFVEWKH3_kQmF4bllVB0rZ0hDS4eDCF6WkC43csN_4gnAnC4XdMpT0AIW9M6dNPg0uD0OFEgzahftougnQ-qc-CzgYv3_2My6hbLc1smdY0UKtz5n5igQhVhsuACR38nr2WKDV_bpjjiNOrw8wRLhI0D5WE')",
                }}
              ></div>
            </div>

            {/* Right Content */}
            <div className="md:col-span-6 lg:col-span-5 lg:col-start-7 flex flex-col gap-6">
              <p className="font-label-caps text-label-caps text-tertiary-container tracking-[0.2em] uppercase">
                The Master Behind the Craft
              </p>
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
                25+ Years of Experience.<br />A Lifetime of Precision.
              </h2>
              <p className="font-body-md text-body-md text-secondary mt-2">
                Our atelier is founded on the principles of traditional Savile Row tailoring infused with contemporary minimalism. Every stitch is deliberate, every cut calculated to enhance your natural silhouette. We don't just make clothes; we architect confidence.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/craft')}
                  className="font-label-caps text-label-caps text-primary uppercase inline-flex items-center gap-2 group pb-1 border-b hairline-border-gold hover:text-tertiary-container transition-colors"
                >
                  Discover Our Story
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES (Bento/Card layout) */}
      <section className="py-[128px] w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">OUR SERVICES</h2>
          </div>
          <button
            onClick={() => navigate('/bespoke')}
            className="font-label-caps text-label-caps text-primary uppercase pb-1 border-b hairline-border hover:border-tertiary-container transition-colors"
          >
            View All Services
          </button>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter">
          {/* Service 1 (Large) */}
          <div onClick={() => navigate('/bespoke')} className="md:col-span-8 group cursor-pointer">
            <div className="relative aspect-[16/9] w-full overflow-hidden hairline-border border-transparent group-hover:border-primary transition-colors duration-500">
              <div
                className="bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPo95bZLCT8FfKIJSlDptBzD7Cw0zt-y5gj9G0p7qxClsbXE12se5f6BF-z5RsWPcZ547xaZVY7Cuz9B_GenP--H1wzvr_ghnY5IFwPdIt-jI0nCfe1n9bI1MlsCfHXLkq4Ak4rfcN1cwAds-MFjH3x2yszB2Vr_1ONaeb1Q8JNFQMKrGHWufkC4Bp2ycucw5O9SeWO6MIXBfyUqfezIPIWIwatG5fdmleIh5YtLOljd5xXdC5z_4')",
                }}
              ></div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-primary">Bespoke Tailoring</h3>
              <span className="material-symbols-outlined text-secondary group-hover:text-tertiary-container transition-colors">arrow_forward</span>
            </div>
            <p className="font-body-md text-body-md text-secondary mt-2 max-w-lg">From initial pattern drafting to final pressing, a truly unique garment constructed entirely for your physique.</p>
          </div>

          {/* Service 2 (Small Vertical) */}
          <div onClick={() => navigate('/men')} className="md:col-span-4 group cursor-pointer md:mt-24">
            <div className="relative aspect-[3/4] w-full overflow-hidden hairline-border border-transparent group-hover:border-primary transition-colors duration-500">
              <div
                className="bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0J4lLPNeUq9zEDrVWjmlDFw-tvGnvfcH9ZORpKcDKY2dOfz8L_fHFSJ2qZZoUr7fx0NCueRNQpZz3XgYXK8win2o-olBY_0q2IBoK34kF0NGCgRTbCGojTYIDhW9JL8qOQe5n37_vboECI-DnuP6LInBz0PCEBxuqJHOmgwWJhZN9ZMPY4UR9UEldPHeVN5ua13_CUjTX5SO3HwUvGUwvCGtzKszz76JQmaKMXFMHrn4FVFPi7Uo')",
                }}
              ></div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <h3 className="font-headline-md text-[24px] text-primary">Suit & Blazer Tailoring</h3>
            </div>
          </div>

          {/* Service 3, 4, 5 (Row of 3) */}
          <div onClick={() => navigate('/alterations')} className="md:col-span-4 group cursor-pointer">
            <div className="relative aspect-[4/3] w-full overflow-hidden hairline-border border-transparent group-hover:border-primary transition-colors duration-500">
              <div
                className="bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAjq_7_sxFZoHVMLvL6PAUy2uSK3RbggjB33-loaqUasITC1RRzxr2qoSYMRm6zgTdCm3xrL3II_rRDAv3IB_byWSxNM5Oghavf_wUG2PTyX0rwqZm6hyQnQ5imjnvkmM8ZWvj35n6CzUeNSYm4EOVp7leG9PDCoq9tTfbq9ibJnf0LcrJcAqWiBnZQkKqcTDz70guJTP3LGFg9Vi0-AxgNs6fNqB8Jik1rhRIc_s3DLJKx-90lN8w')",
                }}
              ></div>
            </div>
            <h3 className="font-label-caps text-label-caps text-primary uppercase mt-4">Luxury Alterations</h3>
          </div>

          <div onClick={() => navigate('/women')} className="md:col-span-4 group cursor-pointer">
            <div className="relative aspect-[4/3] w-full overflow-hidden hairline-border border-transparent group-hover:border-primary transition-colors duration-500">
              <div
                className="bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA39UQCw73UVOrQVQW0pLXY5MIN6nqJvW0gc8MUTdhZzNHuoQEyLQPM2832Qrg0z-OnhjeImAJg4tLZnqyKwWTPc9m_4kk9j165KXJf-81axo3s7tkmkH9y_ycECRsLRW_IJDO9WcZ2LNPs8DpTSa945f01RrDIkrEqMwz6gu-xVyOqj94CjOvdld1bLxP-97CRVoo-SJGa-wLH-M-yC0ZQiOq2hw7fFuOQS_aq2FueUJdz5VFaQH0')",
                }}
              ></div>
            </div>
            <h3 className="font-label-caps text-label-caps text-primary uppercase mt-4">Bridal & Women's Tailoring</h3>
          </div>

          <div onClick={() => navigate('/consultation')} className="md:col-span-4 group cursor-pointer">
            <div className="relative aspect-[4/3] w-full overflow-hidden hairline-border border-transparent group-hover:border-primary transition-colors duration-500">
              <div
                className="bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCXmlnlCQSTOQorBEvIzbl0ZM_ypc3uF7rkU9mplr3QFKveRLD54TBl84kTaT0SzcVAqSpJKv9NYDgmoBXHW_2RfC294tNk6CUJR9NkHO-xIejpDOVh98-w4p4OnjU8hsqIZzWRVJfy2phWeDKOug9XU4gVPUY2KeLzhPDptRCdjf94h7VZ1qiCjnEIz_p-v9GDr1j1-rV2QOpuM5FEVDqSpIFGwNOQ3h8hQ_LNQF3jVnRBNwrFUKo')",
                }}
              ></div>
            </div>
            <h3 className="font-label-caps text-label-caps text-primary uppercase mt-4">Doorstep Fitting Service</h3>
          </div>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="py-[128px] w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden flex items-center justify-center">
          <div
            className="bg-cover bg-center w-full h-full absolute inset-0 z-0 brightness-75"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-qczNI1gKGbSKrnxheuibLZSno72eAvdcYpa3J0gpX1Z192m4rhPRdSQmpA7Lx6SSxUNiDYpLaeLy8SqDD5-oxf2yGvPQnV8H3pdB_A-tmqGo2v_IERNwWT8fpm2KazTaOmO9PuLRUtEx1n5m1K9e8iPF08o-jeO_unrJjA5eyzxNdWZoMPfOwS0_UbgmCPEijrhCtqa9lE3u2_Xvs3tD9TY4CLhsYTYIQq3enXT43nKCFxV-K5A')",
            }}
          ></div>
          <div className="relative z-10 text-center flex flex-col items-center px-4">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-primary mb-8 max-w-2xl uppercase">
              Tailoring, At Your Doorstep.
            </h2>
            <button
              onClick={() => navigate('/consultation')}
              className="bg-primary text-on-primary font-label-caps text-label-caps uppercase px-10 py-5 hover:bg-tertiary-container hover:text-primary transition-colors"
            >
              Request Doorstep Service
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
