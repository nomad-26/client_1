import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setToastMessage('Please enter your name, email, and password.');
      return;
    }

    setSubmitting(true);
    try {
      const regUser = await register({ name, email, password, phone, role });
      setToastMessage('Account created successfully!');
      setTimeout(() => {
        if (regUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/account');
        }
      }, 500);
    } catch (err: any) {
      setToastMessage(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto flex items-center justify-center">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      <div className="w-full max-w-md p-10 border border-outline-variant bg-surface-container-lowest shadow-sm space-y-8">
        <div className="text-center">
          <Link to="/" className="font-display-lg text-headline-md tracking-tighter text-primary uppercase block mb-2">
            FANTACY KING
          </Link>
          <p className="font-label-caps text-label-caps text-secondary uppercase">Register New Account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-label-caps text-label-caps text-secondary uppercase mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alexander Wright"
              className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary focus:ring-0 focus:border-tertiary-container"
              required
            />
          </div>

          <div>
            <label className="block font-label-caps text-label-caps text-secondary uppercase mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alexander@example.com"
              className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary focus:ring-0 focus:border-tertiary-container"
              required
            />
          </div>

          <div>
            <label className="block font-label-caps text-label-caps text-secondary uppercase mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 019-2834"
              className="w-full bg-transparent border-0 border-b border-primary py-2 px-0 font-body-md text-primary focus:ring-0 focus:border-tertiary-container"
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

          <div>
            <label className="block font-label-caps text-label-caps text-secondary uppercase mb-2">Account Role</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`px-4 py-2 font-label-caps text-xs uppercase ${role === 'customer' ? 'bg-primary text-on-primary' : 'border hairline-border text-secondary'
                  }`}
              >
                Customer Account
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`px-4 py-2 font-label-caps text-xs uppercase ${role === 'admin' ? 'bg-primary text-on-primary' : 'border hairline-border text-secondary'
                  }`}
              >
                Atelier Staff / Admin
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-on-primary font-label-caps text-label-caps uppercase py-4 hover:bg-tertiary-container hover:text-primary transition-colors"
          >
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="pt-4 text-center text-xs font-body-md">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-primary underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </main>
  );
};
