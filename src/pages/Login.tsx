import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/account', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      setToastMessage('Signed in successfully.');
      setTimeout(() => {
        if (loggedUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/account');
        }
      }, 500);
    } catch (err: any) {
      setToastMessage(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const setDemoAdmin = () => {
    setEmail('admin@threadandstyle.com');
    setPassword('password123');
  };

  const setDemoCustomer = () => {
    setEmail('alexander@example.com');
    setPassword('password123');
  };

  return (
    <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto flex items-center justify-center">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      <div className="w-full max-w-md p-10 border border-outline-variant bg-surface-container-lowest shadow-sm space-y-8">
        <div className="text-center">
          <Link to="/" className="font-display-lg text-headline-md tracking-tighter text-primary uppercase block mb-2">
            FANTACY KING
          </Link>
          <p className="font-label-caps text-label-caps text-secondary uppercase">Private Client Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-label-caps text-label-caps text-secondary uppercase mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary focus:ring-0 focus:border-tertiary-container"
              required
            />
          </div>

          <div>
            <label className="block font-label-caps text-label-caps text-secondary uppercase mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary focus:ring-0 focus:border-tertiary-container"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-on-primary font-label-caps text-label-caps uppercase py-4 hover:bg-tertiary-container hover:text-primary transition-colors"
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-4 border-t border-outline-variant text-center space-y-3">
          <p className="font-caption text-caption text-secondary">Quick Demo Credentials:</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={setDemoCustomer}
              className="px-3 py-1 bg-surface-container-low border border-outline-variant font-label-caps text-[10px] text-primary hover:border-primary"
            >
              Demo Customer
            </button>
            <button
              onClick={setDemoAdmin}
              className="px-3 py-1 bg-surface-container-low border border-outline-variant font-label-caps text-[10px] text-primary hover:border-primary"
            >
              Demo Admin
            </button>
          </div>

          <div className="pt-4 text-xs font-body-md">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary underline">
              Create Client Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
