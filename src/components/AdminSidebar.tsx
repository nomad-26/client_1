import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { label: 'Leads Management', path: '/admin/leads', icon: 'group' },
    { label: 'Tailoring Requests', path: '/admin/requests', icon: 'work_history' },
    { label: 'Consultations', path: '/admin/consultations', icon: 'event' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col hidden md:flex h-screen flex-shrink-0 sticky top-0">
      <div className="p-6 border-b border-outline-variant">
        <Link to="/admin" className="font-headline-md text-headline-md text-primary tracking-tighter leading-none block">
          T&S
        </Link>
        <p className="font-label-caps text-label-caps text-secondary mt-1 uppercase">Admin Portal</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-4">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 transition-colors ${
                    active
                      ? 'bg-primary-container text-on-primary font-semibold'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-label-caps text-label-caps">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-outline-variant flex flex-col gap-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary transition-colors font-label-caps text-label-caps"
        >
          <span className="material-symbols-outlined">storefront</span>
          <span>Main Website</span>
        </Link>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary transition-colors font-label-caps text-label-caps text-left w-full"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
