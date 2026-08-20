import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';
import { TailoringRequest } from '../types';

export const RequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<TailoringRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const res = await api.getRequestById(id);
        setRequest(res);
      } catch (err) {
        console.warn('Failed to load request details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 text-center font-body-md text-secondary">
        Loading tailoring request details...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen pt-32 text-center font-body-md text-secondary space-y-4">
        <p>Tailoring request not found.</p>
        <button onClick={() => navigate('/account')} className="text-primary underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface text-on-surface pt-[80px]">
      <CustomerSidebar />

      <main className="flex-1 w-full max-w-[1200px] mx-auto p-margin-mobile md:p-margin-desktop flex flex-col gap-12">
        {/* Breadcrumb */}
        <div className="font-label-caps text-label-caps text-secondary flex items-center gap-2 pt-4">
          <Link to="/account" className="hover:text-primary transition-colors">
            My Account
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary">Request #{request.referenceId}</span>
        </div>

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b hairline-border border-outline-variant">
          <div>
            <span className="font-label-caps text-label-caps text-tertiary-container uppercase tracking-widest block mb-1">
              {request.category} Tailoring Commission
            </span>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              {request.garmentType}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={request.status} />
          </div>
        </header>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Requirements & Notes */}
            <div className="p-8 border border-outline-variant bg-surface-container-lowest space-y-6">
              <h3 className="font-label-caps text-label-caps text-secondary uppercase">Garment Specifications & Vision</h3>
              <p className="font-body-md text-primary leading-relaxed">{request.requirements}</p>

              {request.notes && request.notes.length > 0 && (
                <div className="pt-6 border-t border-outline-variant space-y-4">
                  <h4 className="font-label-caps text-label-caps text-secondary uppercase">Tailor Notes & Updates</h4>
                  {request.notes.map((n, idx) => (
                    <div key={idx} className="p-4 bg-surface-container-low border-l-2 border-tertiary-container">
                      <p className="font-caption text-caption text-secondary mb-1">
                        {n.author} • {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                      <p className="font-body-md text-sm text-primary">{n.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reference Images */}
            {request.referenceImages && request.referenceImages.length > 0 && (
              <div className="p-8 border border-outline-variant bg-surface-container-lowest space-y-6">
                <h3 className="font-label-caps text-label-caps text-secondary uppercase">Client Reference Photos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {request.referenceImages.map((img, idx) => (
                    <div key={idx} className="aspect-[3/4] overflow-hidden border border-outline-variant">
                      <img src={img} alt="Reference" className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 border border-outline-variant bg-surface-container-low space-y-6">
              <h3 className="font-headline-md text-[20px] text-primary border-b border-outline-variant pb-4 uppercase">
                Order Summary
              </h3>

              <div className="space-y-4 font-body-md text-sm">
                <div className="flex justify-between border-b border-outline-variant pb-2">
                  <span className="text-secondary font-caption uppercase">Reference Code</span>
                  <span className="font-semibold text-primary font-mono">{request.referenceId}</span>
                </div>

                <div className="flex justify-between border-b border-outline-variant pb-2">
                  <span className="text-secondary font-caption uppercase">Price Quotation</span>
                  <span className="font-bold text-tertiary-container">{request.quotation || 'Pending Review'}</span>
                </div>

                <div className="flex justify-between border-b border-outline-variant pb-2">
                  <span className="text-secondary font-caption uppercase">Assigned Tailor</span>
                  <span className="text-primary font-semibold">{request.assignedTailor || 'Unassigned'}</span>
                </div>

                <div className="flex justify-between border-b border-outline-variant pb-2">
                  <span className="text-secondary font-caption uppercase">Expected Delivery</span>
                  <span className="text-primary">{request.expectedCompletionDate || 'To be scheduled'}</span>
                </div>
              </div>

              {request.measurements && Object.keys(request.measurements).length > 0 && (
                <div className="pt-4 border-t border-outline-variant">
                  <h4 className="font-label-caps text-[10px] text-secondary uppercase mb-3">Measurement Profile Used</h4>
                  <ul className="space-y-2 text-xs">
                    {Object.entries(request.measurements).map(([k, v]) => (
                      <li key={k} className="flex justify-between border-b border-dashed border-outline-variant pb-1">
                        <span className="text-secondary capitalize">{k}</span>
                        <span className="font-semibold text-primary">{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
