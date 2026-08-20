import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Lead } from '../types';
import { Toast } from '../components/Toast';

export const AdminLeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState('');
  const [status, setStatus] = useState('Quote Sent');
  const [followUpDate, setFollowUpDate] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const statuses = [
    'New',
    'Contacted',
    'Consultation Scheduled',
    'Quote Sent',
    'Confirmed',
    'In Progress',
    'Completed',
    'Archived',
  ];

  useEffect(() => {
    const fetchLeadDetail = async () => {
      if (!id) return;
      try {
        const res = await api.getLeadById(id);
        setLead(res);
        setStatus(res.status);
        setFollowUpDate(res.followUpDate || '');
      } catch (err) {
        console.warn('Failed to fetch lead details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeadDetail();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!id) return;
    setStatus(newStatus);
    setDropdownOpen(false);
    try {
      const updated = await api.updateLead(id, { status: newStatus as any });
      setLead(updated);
      setToastMessage(`Status updated to "${newStatus}"`);
    } catch (err: any) {
      setToastMessage('Failed to update status.');
    }
  };

  const handleSaveNote = async () => {
    if (!id || !newNote.trim()) return;
    try {
      const updated = await api.addLeadNote(id, newNote);
      setLead(updated);
      setNewNote('');
      setToastMessage('Admin note saved.');
    } catch (err: any) {
      setToastMessage('Failed to save note.');
    }
  };

  const handleScheduleFollowUp = async () => {
    if (!id) return;
    try {
      const updated = await api.updateLead(id, { followUpDate });
      setLead(updated);
      setToastMessage(`Follow-up scheduled for ${followUpDate}`);
    } catch (err: any) {
      setToastMessage('Failed to schedule follow-up.');
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-32 text-center text-secondary">Loading lead record...</div>;
  }

  if (!lead) {
    return (
      <div className="min-h-screen pt-32 text-center text-secondary space-y-4">
        <p>Lead record not found.</p>
        <button onClick={() => navigate('/admin/leads')} className="text-primary underline">
          Return to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/95 dark:bg-surface/95 backdrop-blur-md border-b border-secondary-container">
        <div className="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/admin" className="font-label-caps text-label-caps text-secondary hover:text-primary">
              Dashboard
            </Link>
            <Link to="/admin/leads" className="font-label-caps text-label-caps text-primary border-b border-tertiary-fixed pb-1 font-semibold">
              Leads Management
            </Link>
            <Link to="/admin/requests" className="font-label-caps text-label-caps text-secondary hover:text-primary">
              Tailoring Orders
            </Link>
          </div>

          <div className="font-display-lg text-[24px] tracking-tighter text-primary text-center flex-1 md:flex-none uppercase">
            FANTACY KING ADMIN
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-label-caps text-label-caps text-secondary hover:text-primary uppercase">
              Main Site
            </Link>
            <button
              onClick={() => navigate('/admin/leads')}
              className="font-label-caps text-label-caps uppercase text-on-primary bg-primary-container px-6 py-3 hover:bg-tertiary-container hover:text-primary transition-colors"
            >
              Back to Leads
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
        {/* Breadcrumb */}
        <div className="mb-12 font-label-caps text-label-caps text-secondary flex items-center gap-2">
          <Link to="/admin/leads" className="hover:text-primary transition-colors">
            Leads
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary">Lead #{lead.leadId}</span>
        </div>

        {/* Layout Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column: Details & Images (8 cols) */}
          <div className="lg:col-span-8 space-y-16">
            {/* Customer Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 hairline-border border-b border-outline-variant">
              <div>
                <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">
                  {lead.name}
                </h1>
                <div className="font-body-md text-body-md text-secondary flex items-center gap-6">
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                    {lead.phone}
                  </a>
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                    {lead.email}
                  </a>
                </div>
              </div>

              {/* Status Dropdown */}
              <div className="relative">
                <label className="block font-label-caps text-label-caps text-secondary mb-2 uppercase">Current Status</label>
                <div className="relative cursor-pointer">
                  <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="border border-outline bg-transparent py-3 px-4 flex items-center justify-between gap-8 hover:border-tertiary-container transition-colors min-w-[200px]"
                  >
                    <span className="font-label-caps text-label-caps text-primary uppercase">{status}</span>
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>

                  {dropdownOpen && (
                    <div className="absolute top-full left-0 w-full bg-surface border border-t-0 border-outline z-20 shadow-lg">
                      {statuses.map((st) => (
                        <div
                          key={st}
                          onClick={() => handleStatusUpdate(st)}
                          className={`px-4 py-3 font-label-caps text-label-caps uppercase text-secondary hover:bg-surface-variant hover:text-primary transition-colors cursor-pointer ${st === status ? 'bg-surface-variant text-primary font-semibold' : ''
                            }`}
                        >
                          {st}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Lead Info Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-label-caps text-label-caps text-secondary mb-4 uppercase">Inquiry Details</h3>
                <div className="space-y-6">
                  <div>
                    <span className="block font-caption text-caption text-secondary mb-1 uppercase">Service Requested</span>
                    <span className="font-body-lg text-body-lg text-primary">{lead.service}</span>
                  </div>
                  <div>
                    <span className="block font-caption text-caption text-secondary mb-1 uppercase">Inquiry Date</span>
                    <span className="font-body-md text-body-md text-primary">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="block font-caption text-caption text-secondary mb-1 uppercase">Source</span>
                    <span className="font-body-md text-body-md text-primary">{lead.source || 'Direct Website Inquiry'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-label-caps text-label-caps text-secondary mb-4 uppercase">Initial Message</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  "{lead.requirements || 'Interested in scheduling a consultation for custom bespoke tailoring.'}"
                </p>
              </div>
            </section>

            {/* Client Inspiration Photos */}
            <section>
              <h3 className="font-label-caps text-label-caps text-secondary mb-6 uppercase flex items-center justify-between">
                Client Inspiration
                <span className="font-caption text-caption normal-case">
                  {lead.inspirationPhotos?.length || 3} Attachments
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(lead.inspirationPhotos && lead.inspirationPhotos.length > 0
                  ? lead.inspirationPhotos
                  : [
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCAVgt2nNxfJdHqZInVW8rSj7YNDPVE5HzioHIblQNq2rS1vhEcnEE8EIrYQQLupn5kgB95GMNNsxQVqs-Ijrh2L5Apm3UFQmJ3J5irwvMPPVcbeGuRgsh5ifs9TPdzqxcrBSzHlMTElQR7_CMvRKoJ7kU13NkScfJvp-IrB6HZKVb74R__90pai_4peuZpZbdK9D96dbHEGkTtXAd8d3e6ccebuxoPoHAfQERm3TyL_QzGo274NNQ',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuAygpPL7V9NEcnssLApgW5xzDm6HDdQltaD26SVEautn6VTNuon7FvkFkaDU9R9hcUv5Wv6EHu33NbMdXBCyIz0mU7gQgSrnOQqzGVYne3VYBmHVaU1x7CqoUR40JFjR3JL5-82DUiULNfcb8QLe51g7l0nJ-nhZwRkBGKOQDKQwpblyA3sZLKdylY0PNi5TWE9yluzj_aPNKnan4V4hhijTX1BT5aIUpxxO3dcEXkqgK3TzX1SXiM',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuD0gEgASp8VD3KClbV0Y9ghm-DMAhyICdxYerMujfCyhdqx5DgBc8bsqk_Cyp1MB7XRcLD8kxoRj_eak62Iex4ujaFBvCdodJdElwQ8tPNEhZlobn81JiPiRmxVVDXlvsi9G50FROPuFwMmbdvOFjvMVhqGM_vVyWaftk_4fHXlsAmX5oeggHawTx9OimUzjvKWeCM0q-cfI6XFW6Q212RrhN9UXKtkiDsnV-H_WEtoXny6TSECWF0',
                  ]
                ).map((img, idx) => (
                  <div key={idx} className="aspect-[3/4] relative group cursor-pointer overflow-hidden hairline-border border-outline-variant hover:border-tertiary-container transition-colors">
                    <img src={img} alt="Client Inspiration" className="object-cover w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Interactive Action Center (4 cols) */}
          <div className="lg:col-span-4 mt-16 lg:mt-0">
            <div className="bg-surface-container-low p-8 hairline-border border-outline-variant sticky top-32">
              <h2 className="font-headline-md text-headline-md text-primary mb-8 border-b border-outline-variant pb-4 hairline-border uppercase">
                Action Center
              </h2>

              {/* Admin Notes */}
              <div className="mb-10">
                <label className="block font-label-caps text-label-caps text-secondary mb-4 uppercase">Admin Notes</label>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add internal notes here..."
                    className="w-full bg-transparent border-0 border-b border-outline focus:border-tertiary-container focus:ring-0 px-0 py-2 font-body-md text-body-md text-primary resize-none"
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSaveNote}
                    className="font-label-caps text-label-caps uppercase text-primary border-b border-tertiary-container hover:text-tertiary transition-colors pb-1"
                  >
                    Save Note
                  </button>
                </div>

                {/* Previous Notes List */}
                <div className="mt-8 space-y-6">
                  {lead.notes && lead.notes.length > 0 ? (
                    lead.notes.map((n, idx) => (
                      <div key={idx} className="pl-4 border-l hairline-border border-outline-variant">
                        <span className="block font-caption text-caption text-secondary mb-1">
                          {new Date(n.createdAt).toLocaleString()} by {n.author || 'S. Taylor'}
                        </span>
                        <p className="font-body-md text-body-md text-on-surface-variant text-sm">{n.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="font-caption text-caption text-secondary italic">No notes recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Schedule Follow-up */}
              <div>
                <label className="block font-label-caps text-label-caps text-secondary mb-4 uppercase">Schedule Follow-up</label>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-outline focus:border-tertiary-container focus:ring-0 px-0 py-2 font-body-md text-body-md text-primary cursor-pointer"
                    />
                  </div>
                  <button
                    onClick={handleScheduleFollowUp}
                    className="w-full bg-primary-container text-on-primary font-label-caps text-label-caps uppercase py-4 hover:bg-tertiary-container hover:text-primary transition-colors mt-4"
                  >
                    Set Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
