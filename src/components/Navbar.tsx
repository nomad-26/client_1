import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Bespoke', path: '/bespoke' },
    { name: 'Alterations', path: '/alterations' },
    { name: 'Men', path: '/men' },
    { name: 'Women', path: '/women' },
    { name: 'Our Craft', path: '/craft' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/95 dark:bg-surface/95 backdrop-blur-md border-b border-secondary-container dark:border-on-secondary-fixed-variant">
      {/* Desktop Header */}
      <div className="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto hidden md:flex">
        {/* Brand */}
        <Link to="/" className="font-display-lg text-[24px] tracking-tighter text-primary uppercase">
          FANTACY KING
        </Link>

        {/* Nav Links */}
        <nav className="flex gap-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-label-caps text-label-caps uppercase transition-all duration-300 ${isActive(item.path)
                  ? 'text-primary border-b border-tertiary-fixed pb-1'
                  : 'text-secondary hover:text-primary hover:text-tertiary'
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/consultation')}
            className="bg-primary text-on-primary font-label-caps text-label-caps uppercase px-6 py-3 hover:bg-tertiary-container hover:text-primary transition-colors"
          >
            Book Appointment
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to={user?.role === 'admin' ? '/admin' : '/account'}
                className="font-label-caps text-label-caps uppercase text-primary border-b border-primary hover:border-tertiary-container transition-colors"
              >
                {user?.role === 'admin' ? 'Admin Portal' : 'My Account'}
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="text-secondary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="font-label-caps text-label-caps uppercase text-primary border-b border-transparent hover:border-primary transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex justify-between items-center px-margin-mobile py-4 md:hidden">
        <Link to="/" className="font-display-lg text-[20px] tracking-tighter text-primary uppercase">
          FANTACY KING
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/consultation')}
            className="bg-primary text-on-primary font-label-caps text-[10px] uppercase px-3 py-2"
          >
            Book
          </button>
          <button
            aria-label="Menu"
            className="text-primary p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-outline-variant px-margin-mobile py-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-label-caps text-label-caps uppercase py-2 border-b border-outline-variant ${isActive(item.path) ? 'text-primary font-semibold' : 'text-secondary'
                }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex justify-between items-center pt-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/account'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-label-caps text-label-caps uppercase text-primary"
                >
                  {user?.role === 'admin' ? 'Admin Portal' : 'My Account'}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="font-label-caps text-label-caps text-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="font-label-caps text-label-caps uppercase text-primary"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
