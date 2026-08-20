import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const CustomerSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/account', icon: 'dashboard' },
    { label: 'Appointments', path: '/account/consultations', icon: 'calendar_month' },
    { label: 'My Requests', path: '/account/requests', icon: 'work_history' },
    { label: 'Measurements', path: '/account/measurements', icon: 'straighten' },
    { label: 'Profile & Settings', path: '/account/profile', icon: 'person' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-outline-variant bg-surface-container-lowest sticky top-[80px] h-[calc(100vh-80px)] shrink-0">
      <div className="p-8 pb-8">
        <div className="font-display-lg text-headline-md tracking-tighter text-primary mb-2 uppercase">
          FANTACY KING
        </div>
        <p className="font-caption text-caption text-secondary mb-8">Customer Workspace</p>

        <nav className="flex flex-col gap-6">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-4 relative transition-colors ${active ? 'text-primary' : 'text-secondary hover:text-primary'
                  }`}
              >
                {active && (
                  <span className="absolute -left-8 w-[3px] h-full bg-tertiary-container"></span>
                )}
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-caps text-label-caps">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-outline-variant">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center gap-4 text-secondary hover:text-primary transition-colors w-full text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-caps text-label-caps">Log Out</span>
        </button>
      </div>
    </aside>
  );
};
