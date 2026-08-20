import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';
import { TailoringRequest } from '../types';
import { Toast } from '../components/Toast';

export const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<TailoringRequest[]>([]);
  const [selectedReq, setSelectedReq] = useState<TailoringRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState('In Progress');
  const [quotation, setQuotation] = useState('');
  const [assignedTailor, setAssignedTailor] = useState('');
  const [expectedCompletionDate, setExpectedCompletionDate] = useState('');
  const [noteText, setNoteText] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const statuses = ['New', 'Pending', 'Confirmed', 'In Progress', 'Ready', 'Completed', 'Cancelled'];

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getRequests();
      setRequests(res);
      if (res.length > 0 && !selectedReq) {
        setSelectedReq(res[0]);
        setStatus(res[0].status);
        setQuotation(res[0].quotation || '');
        setAssignedTailor(res[0].assignedTailor || 'Unassigned');
        setExpectedCompletionDate(res[0].expectedCompletionDate || '');
      }
    } catch (err: any) {
      setError('Failed to load tailoring orders.');
      console.warn('Failed to load requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSelectReq = (req: TailoringRequest) => {
    setSelectedReq(req);
    setStatus(req.status);
    setQuotation(req.quotation || '');
    setAssignedTailor(req.assignedTailor || 'Unassigned');
    setExpectedCompletionDate(req.expectedCompletionDate || '');
  };

  const handleUpdate = async () => {
    if (!selectedReq) return;
    try {
      const updated = await api.updateRequestStatus(selectedReq.id || selectedReq.referenceId, {
        status: status as any,
        quotation,
        assignedTailor,
        expectedCompletionDate,
        note: noteText,
      });

      setSelectedReq(updated);
      setNoteText('');
      setToastMessage(`Request #${selectedReq.referenceId} updated!`);
      fetchRequests();
    } catch (err: any) {
      setToastMessage('Failed to update request.');
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased flex h-screen overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto bg-surface relative flex flex-col h-full">
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

        <div className="p-6 md:p-8 flex-1 max-w-[1600px] mx-auto w-full space-y-8">
          <div className="border-b border-outline-variant pb-6">
            <p className="font-label-caps text-label-caps text-secondary uppercase">Order & Tailoring Management</p>
            <h1 className="font-headline-md text-headline-md text-primary">Active Bespoke & Alteration Orders</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Left Column: Request List (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-label-caps text-label-caps text-secondary uppercase">
                Commissions Pool
                {!loading && !error && <span className="ml-2 text-primary">({requests.length})</span>}
              </h3>

              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="p-5 border border-outline-variant bg-surface-container-low space-y-2 animate-pulse">
                    <div className="h-3 bg-surface-container rounded w-1/3" />
                    <div className="h-5 bg-surface-container rounded w-2/3" />
                    <div className="h-3 bg-surface-container rounded w-1/4" />
                  </div>
                ))
              ) : error ? (
                <div className="p-6 text-center border border-outline-variant bg-surface-container-lowest">
                  <span className="material-symbols-outlined text-3xl text-outline block mb-2">error_outline</span>
                  <p className="font-body-md text-sm text-secondary mb-4">{error}</p>
                  <button onClick={fetchRequests} className="font-label-caps text-label-caps text-primary border border-primary px-4 py-2 hover:bg-primary hover:text-on-primary transition-colors uppercase">
                    Retry
                  </button>
                </div>
              ) : requests.length === 0 ? (
                <div className="p-8 text-center border border-outline-variant bg-surface-container-lowest">
                  <span className="material-symbols-outlined text-4xl text-outline block mb-2">content_cut</span>
                  <p className="font-body-md text-sm text-secondary">No tailoring orders yet.</p>
                </div>
              ) : (
                requests.map((r) => {
                  const isSelected = selectedReq?.id === r.id || selectedReq?.referenceId === r.referenceId;
                  return (
                    <div
                      key={r.id || r.referenceId}
                      onClick={() => handleSelectReq(r)}
                      className={`p-5 border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-surface-container-lowest shadow-sm'
                          : 'border-outline-variant bg-surface-container-low hover:border-outline'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-caption text-caption text-secondary font-mono">#{r.referenceId}</span>
                        <StatusBadge status={r.status} size="sm" />
                      </div>
                      <h4 className="font-headline-md text-[18px] text-primary">{r.garmentType}</h4>
                      <p className="font-body-md text-xs text-secondary mt-1">{r.customerName}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Selected Request Controls & Review (7 cols) */}
            {selectedReq && (
              <div className="lg:col-span-7 space-y-6 bg-surface-container-lowest p-8 border border-outline-variant">
                <div className="flex justify-between items-start border-b border-outline-variant pb-6">
                  <div>
                    <span className="font-label-caps text-label-caps text-tertiary-container uppercase">
                      {selectedReq.category} Order
                    </span>
                    <h2 className="font-headline-md text-headline-md text-primary mt-1">{selectedReq.garmentType}</h2>
                    <p className="font-body-md text-sm text-secondary">
                      Client: {selectedReq.customerName} ({selectedReq.email})
                    </p>
                  </div>
                  <StatusBadge status={selectedReq.status} />
                </div>

                {/* Edit Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block font-label-caps text-xs text-secondary uppercase mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-primary py-1 font-body-md text-primary"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-label-caps text-xs text-secondary uppercase mb-1">Price Quotation</label>
                    <input
                      type="text"
                      value={quotation}
                      onChange={(e) => setQuotation(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-primary py-1 font-body-md text-primary font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-label-caps text-xs text-secondary uppercase mb-1">Assigned Master Tailor</label>
                    <input
                      type="text"
                      value={assignedTailor}
                      onChange={(e) => setAssignedTailor(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-primary py-1 font-body-md text-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-label-caps text-xs text-secondary uppercase mb-1">Expected Completion Date</label>
                    <input
                      type="date"
                      value={expectedCompletionDate}
                      onChange={(e) => setExpectedCompletionDate(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-primary py-1 font-body-md text-primary cursor-pointer"
                    />
                  </div>
                </div>

                {/* Requirements & Notes */}
                <div className="pt-4 border-t border-outline-variant space-y-4">
                  <h4 className="font-label-caps text-xs text-secondary uppercase">Requirements & Notes</h4>
                  <p className="font-body-md text-sm text-primary p-4 bg-surface-container-low border border-outline-variant">
                    {selectedReq.requirements}
                  </p>

                  <div>
                    <label className="block font-label-caps text-xs text-secondary uppercase mb-1">Add Internal Tailor Note</label>
                    <textarea
                      rows={2}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Enter update for client or internal workshop..."
                      className="w-full bg-transparent border-0 border-b border-primary py-1 font-body-md text-sm text-primary resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleUpdate}
                    className="bg-primary text-on-primary font-label-caps text-label-caps uppercase px-8 py-3 hover:bg-tertiary-container hover:text-primary transition-colors"
                  >
                    Save & Update Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
