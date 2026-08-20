import { createClient } from "@supabase/supabase-js";
import { Users, CalendarDays, Scissors, ShoppingCart, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getAdminClient() {
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
        }
    });
}

export default async function DashboardPage() {
    const supabase = getAdminClient();

    // Fetch real metrics efficiently
    const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
    const { count: newLeadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'NEW');

    // Recent Leads
    const { data: recentLeads } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
                <p className="text-sm text-gray-500">Welcome to your operational dashboard. Here is what is happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Total Leads" value={leadsCount?.toString() || "0"} icon={<Users className="text-indigo-500" size={24} />} trend="All time DB count" />
                <KpiCard title="New Leads" value={newLeadsCount?.toString() || "0"} icon={<Users className="text-blue-500" size={24} />} trend="Fresh inquiries" />
                <KpiCard title="Work in Progress" value="-" icon={<Scissors className="text-amber-500" size={24} />} trend="Orders tracking" />
                <KpiCard title="Completed Orders" value="-" icon={<ShoppingCart className="text-green-500" size={24} />} trend="Archived works" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Leads */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Leads (Live from DB)</h2>
                        <Link href="/dashboard/leads" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                            View all <ArrowUpRight size={16} className="ml-1" />
                        </Link>
                    </div>
                    <div className="p-0">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentLeads?.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">No leads in database yet.</td>
                                    </tr>
                                ) : (
                                    recentLeads?.map((lead) => (
                                        <tr key={lead.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.first_name} {lead.last_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Realtime Binding active</h2>
                    <div className="flex-1 flex flex-col justify-center gap-4 text-center text-gray-500 text-sm">
                        Data is now pulling actively securely via SSR using the Supabase Service Key bounds.
                    </div>
                </div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
                <p className="text-xs text-gray-400">{trend}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
                {icon}
            </div>
        </div>
    );
}
