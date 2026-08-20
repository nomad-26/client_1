import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { StatusBadge } from '../components/StatusBadge';
import { api, DashboardStats } from '../services/api';
import { Lead } from '../types';

const StatCard: React.FC<{
  label: string;
  value: number | string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  loading?: boolean;
  accent?: boolean;
}> = ({ label, value, icon, trend, trendUp, loading, accent }) => (
  <div className={`dash-card p-5 ${accent ? 'bg-surface-container-low border-none' : ''}`}>
    <div className="flex justify-between items-start mb-4">
      <p className="font-label-caps text-label-caps text-secondary uppercase">{label}</p>
      <span className="material-symbols-outlined text-outline">{icon}</span>
    </div>
    <div className="flex items-baseline gap-3">
      {loading ? (
        <div className="h-8 w-16 bg-surface-container-low animate-pulse rounded" />
      ) : (
        <h3 className="font-headline-md text-headline-md text-primary">{value}</h3>
      )}
      {trend && !loading && (
        <span className={`font-caption text-caption flex items-center ${trendUp ? 'text-tertiary-container' : 'text-secondary'}`}>
          <span className="material-symbols-outlined text-[14px]">{trendUp ? 'arrow_upward' : 'arrow_downward'}</span>
          {trend}
        </span>
      )}
    </div>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [leadsRes, statsRes] = await Promise.all([
          api.getLeads(),
          api.getDashboardStats(),
        ]);
        setLeads(leadsRes);
        setStats(statsRes);
      } catch (err) {
        console.warn('Failed to load admin dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Build service demand bars from real leads data
  const serviceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    const key = l.service?.split(' ')[0] || 'Other';
    serviceCounts[key] = (serviceCounts[key] || 0) + 1;
  });
  const topServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const maxService = Math.max(...topServices.map(([, v]) => v), 1);

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased flex h-screen overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto bg-surface relative flex flex-col h-full">
        {/* Mobile Header */}
        <header className="md:hidden bg-surface-container-lowest border-b border-outline-variant p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tighter leading-none">T&S Admin</h1>
          <button onClick={() => navigate('/admin/leads')} className="text-primary text-xs font-label-caps uppercase">
            Leads
          </button>
        </header>

        <div className="p-6 md:p-8 flex-1 max-w-[1600px] mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary mb-1">Admin Dashboard Overview</h2>
              <p className="font-body-md text-body-md text-secondary">A live snapshot of your current lead funnel and operations.</p>
            </div>
            <div className="flex items-center gap-2 border-b border-primary pb-1">
              <span className="material-symbols-outlined text-secondary text-sm">calendar_today</span>
              <span className="font-label-caps text-label-caps text-primary text-xs uppercase">Live Data</span>
            </div>
          </div>

          {/* Stats Grid — all driven from /api/stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Leads"
              value={stats?.totalLeads ?? 0}
              icon="group"
              trend={stats && stats.totalLeads > 0 ? `${stats.totalLeads} total` : undefined}
              trendUp={true}
              loading={loading}
            />
            <StatCard
              label="New Leads"
              value={stats?.newLeads ?? 0}
              icon="fiber_new"
              trend={stats && stats.newLeads > 0 ? 'Needs attention' : undefined}
              trendUp={true}
              loading={loading}
            />
            <StatCard
              label="Consultations Scheduled"
              value={stats?.consultationsScheduled ?? 0}
              icon="event_available"
              loading={loading}
              accent={true}
            />
            <StatCard
              label="Active Orders"
              value={stats?.activeRequests ?? 0}
              icon="design_services"
              trend={stats?.completedOrders ? `${stats.completedOrders} completed` : undefined}
              trendUp={false}
              loading={loading}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Lead Status Breakdown */}
            <div className="dash-card p-6 flex flex-col">
              <h3 className="font-label-caps text-label-caps text-primary mb-6 uppercase">Lead Status Breakdown</h3>
              <div className="flex flex-col gap-3 flex-1">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-6 bg-surface-container-low animate-pulse rounded" />
                    ))}
                  </div>
                ) : (() => {
                  const statusGroups: Record<string, number> = {};
                  leads.forEach((l) => {
                    statusGroups[l.status] = (statusGroups[l.status] || 0) + 1;
                  });
                  const total = leads.length || 1;
                  const statusColors: Record<string, string> = {
                    New: 'bg-primary',
                    Contacted: 'bg-surface-tint',
                    'Quote Sent': 'bg-tertiary-container',
                    'In Progress': 'bg-outline',
                    Completed: 'bg-secondary-fixed-dim',
                    Confirmed: 'bg-tertiary-container',
                  };
                  return Object.entries(statusGroups).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-3">
                      <span className="font-caption text-caption text-secondary w-28 shrink-0 uppercase">{status}</span>
                      <div className="flex-1 bg-surface-container-low h-2 relative">
                        <div
                          className={`h-2 ${statusColors[status] || 'bg-outline'} transition-all duration-700`}
                          style={{ width: `${Math.round((count / total) * 100)}%` }}
                        />
                      </div>
                      <span className="font-caption text-caption text-primary w-6 text-right">{count}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Service Demand — from real lead data */}
            <div className="dash-card p-6 flex flex-col">
              <h3 className="font-label-caps text-label-caps text-primary mb-6 uppercase">Service Demand</h3>
              <div className="flex-1 min-h-[200px] relative border-b border-l border-outline-variant flex items-end justify-around px-2 pb-0 pt-8 gap-4">
                <div className="absolute left-[-24px] top-0 bottom-0 flex flex-col justify-between text-caption text-secondary font-caption py-2">
                  <span>{maxService}</span>
                  <span>{Math.round(maxService / 2)}</span>
                  <span>0</span>
                </div>
                {loading ? (
                  <div className="flex gap-4 items-end w-full h-full pb-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex-1 bg-surface-container-low animate-pulse" style={{ height: `${i * 20}%` }} />
                    ))}
                  </div>
                ) : topServices.length > 0 ? (
                  topServices.map(([name, count], idx) => {
                    const heightPct = Math.round((count / maxService) * 100);
                    const colors = ['bg-primary', 'bg-surface-tint', 'bg-outline', 'bg-secondary-fixed-dim'];
                    return (
                      <div
                        key={name}
                        className={`flex-1 ${colors[idx % 4]} relative group cursor-pointer transition-all hover:bg-tertiary-container`}
                        style={{ height: `${Math.max(heightPct, 5)}%` }}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-caption text-primary font-caption opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {count}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center w-full text-secondary font-caption text-sm">No data yet</div>
                )}
                <div className="absolute bottom-[-32px] left-0 right-0 flex justify-around text-caption text-secondary font-caption px-2 text-center">
                  {loading
                    ? ['Bespoke', 'Alterations', 'Styling', 'Bridal'].map((l) => (
                        <span key={l} className="flex-1 truncate">{l}</span>
                      ))
                    : topServices.map(([name]) => (
                        <span key={name} className="flex-1 truncate">{name}</span>
                      ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Leads Table */}
          <div className="dash-card overflow-hidden">
            <div className="p-6 border-b border-surface-variant flex justify-between items-center">
              <h3 className="font-label-caps text-label-caps text-primary uppercase">Recent Leads</h3>
              <Link
                to="/admin/leads"
                className="font-label-caps text-label-caps text-secondary hover:text-primary transition-colors border-b border-secondary hover:border-primary pb-0.5 uppercase"
              >
                View All Leads
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse dash-table">
                <thead>
                  <tr>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary font-semibold uppercase">Lead ID</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary font-semibold uppercase">Customer Name</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary font-semibold uppercase">Service Type</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary font-semibold uppercase">Status</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary font-semibold text-right uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md text-on-surface">
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i}>
                        {[1, 2, 3, 4, 5].map((j) => (
                          <td key={j} className="py-4 px-6">
                            <div className="h-4 bg-surface-container-low animate-pulse rounded w-3/4" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-secondary font-body-md">
                        No leads found. They will appear here when customers submit inquiries.
                      </td>
                    </tr>
                  ) : (
                    leads.slice(0, 6).map((lead) => (
                      <tr key={lead.id || lead.leadId} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-4 px-6 text-secondary font-caption">#LD-{lead.leadId}</td>
                        <td className="py-4 px-6 font-semibold">{lead.name}</td>
                        <td className="py-4 px-6">{lead.service}</td>
                        <td className="py-4 px-6">
                          <StatusBadge status={lead.status} size="sm" />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => navigate(`/admin/leads/${lead.id || lead.leadId}`)}
                            className="font-label-caps text-label-caps text-primary border border-primary px-3 py-1 hover:bg-primary hover:text-on-primary transition-colors uppercase"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="h-16"></div>
        </div>
      </main>
    </div>
  );
};
