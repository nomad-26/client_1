import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';
import { Lead } from '../types';

export const AdminLeads: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getLeads({ search, status: statusFilter });
      setLeads(res);
    } catch (err: any) {
      setError('Failed to load leads. Please try again.');
      console.warn('Failed to load leads', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const debounce = setTimeout(fetchLeads, search ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [fetchLeads, search]);

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased flex h-screen overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto bg-surface relative flex flex-col h-full">
        <div className="p-6 md:p-8 flex-1 max-w-[1600px] mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant pb-6">
            <div>
              <p className="font-label-caps text-label-caps text-secondary uppercase">Lead Management</p>
              <h1 className="font-headline-md text-headline-md text-primary">Inquiries & Consultation Funnel</h1>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customer, ID or email..."
                  className="w-full bg-surface-container-lowest border border-outline-variant py-2 pl-9 pr-4 text-sm font-body-md focus:border-primary outline-none"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-secondary text-sm">search</span>
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-2.5 text-secondary hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant py-2 px-4 font-label-caps text-xs text-primary focus:border-primary cursor-pointer outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Consultation Scheduled">Consultation Scheduled</option>
                <option value="Quote Sent">Quote Sent</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>

              <button
                onClick={fetchLeads}
                className="p-2 border border-outline-variant text-secondary hover:text-primary hover:border-primary transition-colors"
                title="Refresh"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
              </button>
            </div>
          </div>

          {/* Count bar */}
          {!loading && !error && (
            <div className="flex items-center gap-2 text-sm text-secondary font-caption">
              <span className="material-symbols-outlined text-[14px]">list</span>
              Showing <strong className="text-primary">{leads.length}</strong> lead{leads.length !== 1 ? 's' : ''}
              {statusFilter !== 'All' && <span> with status <strong className="text-primary">{statusFilter}</strong></span>}
              {search && <span> matching <strong className="text-primary">"{search}"</strong></span>}
            </div>
          )}

          {/* Leads Table */}
          <div className="dash-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse dash-table">
                <thead>
                  <tr>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary font-semibold uppercase">Lead ID</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary font-semibold uppercase">Client Name</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary font-semibold uppercase">Contact</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary font-semibold uppercase">Service</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary font-semibold uppercase">Status</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary font-semibold uppercase">Assigned To</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary font-semibold uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md text-on-surface">
                  {loading ? (
                    // Skeleton rows
                    [...Array(6)].map((_, i) => (
                      <tr key={i}>
                        {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                          <td key={j} className="py-4 px-6">
                            <div className="h-4 bg-surface-container-low animate-pulse rounded w-3/4" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-3 text-secondary">
                          <span className="material-symbols-outlined text-4xl text-outline">error_outline</span>
                          <p className="font-body-md">{error}</p>
                          <button
                            onClick={fetchLeads}
                            className="font-label-caps text-label-caps text-primary border border-primary px-4 py-2 hover:bg-primary hover:text-on-primary transition-colors uppercase"
                          >
                            Retry
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3 text-secondary">
                          <span className="material-symbols-outlined text-5xl text-outline">person_search</span>
                          <p className="font-body-md">No leads matching your criteria.</p>
                          {(search || statusFilter !== 'All') && (
                            <button
                              onClick={() => { setSearch(''); setStatusFilter('All'); }}
                              className="font-label-caps text-label-caps text-primary border-b border-primary hover:text-tertiary-container transition-colors"
                            >
                              Clear Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id || lead.leadId} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-4 px-6 text-secondary font-caption font-semibold">#LD-{lead.leadId}</td>
                        <td className="py-4 px-6 font-semibold">{lead.name}</td>
                        <td className="py-4 px-6 text-xs text-secondary">
                          <div>{lead.email}</div>
                          <div>{lead.phone}</div>
                        </td>
                        <td className="py-4 px-6">{lead.service}</td>
                        <td className="py-4 px-6">
                          <StatusBadge status={lead.status} size="sm" />
                        </td>
                        <td className="py-4 px-6 text-xs text-secondary">{lead.assignedTo || 'Unassigned'}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => navigate(`/admin/leads/${lead.id || lead.leadId}`)}
                            className="font-label-caps text-label-caps text-primary border border-primary px-3 py-1 hover:bg-primary hover:text-on-primary transition-colors uppercase"
                          >
                            Open Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
