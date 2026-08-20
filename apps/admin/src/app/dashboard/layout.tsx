import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Scissors,
    CalendarDays,
    ShoppingCart,
    Image as ImageIcon,
    Star,
    Layers,
    FileText,
    MessageCircleQuestion,
    FolderOpen,
    BarChart,
    Download,
    Settings,
    LogOut
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50 text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <span className="font-bold text-xl tracking-tight">Admin<span className="text-blue-600">Portal</span></span>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem href="/dashboard/leads" icon={<Users size={20} />} label="Leads" />
                    <NavItem href="/dashboard/customers" icon={<Scissors size={20} />} label="Customers" />
                    <NavItem href="/dashboard/appointments" icon={<CalendarDays size={20} />} label="Appointments" />
                    <NavItem href="/dashboard/orders" icon={<ShoppingCart size={20} />} label="Orders" />
                    <NavItem href="/dashboard/portfolio" icon={<ImageIcon size={20} />} label="Portfolio" />
                    <NavItem href="/dashboard/reviews" icon={<Star size={20} />} label="Reviews" />
                    <NavItem href="/dashboard/services" icon={<Layers size={20} />} label="Services" />
                    <NavItem href="/dashboard/blog" icon={<FileText size={20} />} label="Blog" />
                    <NavItem href="/dashboard/faq" icon={<MessageCircleQuestion size={20} />} label="FAQ" />
                    <NavItem href="/dashboard/media" icon={<FolderOpen size={20} />} label="Media" />
                    <NavItem href="/dashboard/analytics" icon={<BarChart size={20} />} label="Analytics" />
                    <NavItem href="/dashboard/exports" icon={<Download size={20} />} label="Exports" />
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <NavItem href="/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
                    <button className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors mt-1">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex-1 text-sm text-gray-500 font-medium">
                        Welcome back, Admin
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                            A
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
