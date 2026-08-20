import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';
import { Consultation, TailoringRequest } from '../types';

export const AccountDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [requests, setRequests] = useState<TailoringRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [consRes, reqsRes] = await Promise.all([
          api.getConsultations(),
          api.getRequests(),
        ]);
        setConsultations(consRes);
        setRequests(reqsRes);
      } catch (err) {
        console.warn('Failed to load user account data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextAppointment = consultations.find((c) => c.status === 'Confirmed' || c.status === 'Pending') || consultations[0];
  const activeRequest = requests.find((r) => r.status === 'In Progress' || r.status === 'New') || requests[0];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface text-on-surface pt-[80px]">
      {/* Sidebar Navigation */}
      <CustomerSidebar />

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-margin-mobile md:p-margin-desktop flex flex-col gap-16">
        {/* Header & Profile */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-8">
          <div className="max-w-2xl">
            <p className="font-label-caps text-label-caps text-secondary mb-2 tracking-widest uppercase">DASHBOARD</p>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              Welcome back, <br />
              {user?.name || 'Alexander'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-body-md text-body-md text-primary font-semibold">{user?.name || 'Alexander Wright'}</p>
              <p className="font-caption text-caption text-secondary">{user?.membership || 'Premium Member'}</p>
            </div>
            <img
              className="w-16 h-16 rounded-full object-cover border border-outline-variant"
              alt="Profile portrait"
              src={
                user?.avatar ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuB-TsLpnT60pzCT1dQxlTs22TStCCZywZFw15xJXw96JRCiNLMgun25yAn1dH5IHj3w3fZV9u_ZheV2MJ5p1MDxANCXUNT2eN9e79SlPozxuKp91VKnT24Om63tKkUHKJErUKjvpZCVfuXHZ0a5M67B9AoHQytiB68TCIfAEUw6krAhCQzz1OrhfcCT3ETQt50lzQ1lubeYLJTgckbsXgxKaaPJv_KYHRdW5QBp-nQa2nDU1reo81c'
              }
            />
          </div>
        </header>

        {/* Quick Stats (Bento Grid Style) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stat 1: Next Appointment */}
          <div className="group border border-outline-variant p-8 flex flex-col justify-between min-h-[200px] hover:border-tertiary-container transition-colors relative overflow-hidden bg-surface-container-lowest">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">event</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-secondary mb-4 uppercase">Next Appointment</p>
              <p className="font-headline-md text-headline-md text-primary">
                {nextAppointment ? nextAppointment.date : 'Oct 24'}
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                {nextAppointment ? nextAppointment.service : 'Initial Fitting - Bespoke Suit'}
              </p>
            </div>
            <div className="mt-8 flex justify-between items-center border-t border-outline-variant pt-4">
              <span className="font-caption text-caption text-secondary">{nextAppointment?.location || 'London Atelier'}</span>
              <button
                onClick={() => navigate('/consultation')}
                className="font-label-caps text-label-caps text-primary border-b border-primary hover:border-tertiary-container transition-colors"
              >
                Book New
              </button>
            </div>
          </div>

          {/* Stat 2: Saved Measurements */}
          <div className="group border border-outline-variant p-8 flex flex-col justify-between min-h-[200px] hover:border-tertiary-container transition-colors relative overflow-hidden bg-surface-container-lowest">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">design_services</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-secondary mb-4 uppercase">Saved Profiles</p>
              <p className="font-headline-md text-headline-md text-primary">
                {Object.values(user?.measurements || {}).filter(Boolean).length || 0}
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">Active Measurement Fields</p>
            </div>
            <div className="mt-8 flex justify-between items-center border-t border-outline-variant pt-4">
              <span className="font-caption text-caption text-secondary">
                {user?.measurements && Object.keys(user.measurements).length > 0 ? 'Profile on file' : 'No measurements yet'}
              </span>
              <Link to="/bespoke" className="font-label-caps text-label-caps text-primary border-b border-primary hover:border-tertiary-container transition-colors">
                Update Sets
              </Link>
            </div>
          </div>

          {/* Stat 3: Recent Job */}
          <div className="group border border-outline-variant p-8 flex flex-col justify-between min-h-[200px] hover:border-tertiary-container transition-colors relative overflow-hidden bg-primary text-on-primary">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">inventory_2</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-inverse-primary mb-4 uppercase">Active Commission</p>
              <p className="font-headline-md text-headline-md">{activeRequest?.status || 'In Progress'}</p>
              <p className="font-body-md text-body-md text-inverse-on-surface mt-2">
                {activeRequest?.garmentType || 'Navy Flannel 3-Piece Suit'}
              </p>
            </div>
            <div className="mt-8 flex justify-between items-center border-t border-on-primary-fixed-variant pt-4">
              <span className="font-caption text-caption text-inverse-primary">
                Est. Completion: {activeRequest?.expectedCompletionDate || 'Nov 05'}
              </span>
              {activeRequest && (
                <Link
                  to={`/account/requests/${activeRequest.id || activeRequest.referenceId}`}
                  className="font-label-caps text-label-caps text-tertiary-fixed border-b border-tertiary-fixed hover:text-white hover:border-white transition-colors"
                >
                  Track Status
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Complex Asymmetric Layout: Appointments & Measurements */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mt-8">
          {/* Left Column: Upcoming Appointments (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex justify-between items-end border-b border-primary pb-4">
              <h2 className="font-headline-md text-headline-md text-primary uppercase">My Appointments</h2>
              <button
                onClick={() => navigate('/consultation')}
                className="font-label-caps text-label-caps text-primary flex items-center gap-2 hover:text-tertiary-container transition-colors uppercase"
              >
                <span className="material-symbols-outlined">add</span>
                Book New
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {consultations.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row justify-between sm:items-center p-6 border border-outline-variant bg-surface-container-lowest hover:border-primary transition-colors gap-6"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center justify-center bg-surface-container-low p-4 min-w-[80px]">
                      <span className="font-label-caps text-label-caps text-secondary uppercase">
                        {item.date ? item.date.split('-')[1] || 'OCT' : 'OCT'}
                      </span>
                      <span className="font-headline-md text-headline-md text-primary">
                        {item.date ? item.date.split('-')[2] || '24' : '24'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-body-lg text-body-lg text-primary font-semibold">{item.service}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                        Ref: {item.referenceId}
                      </p>
                      <div className="flex items-center gap-2 mt-3 text-secondary">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        <span className="font-caption text-caption">{item.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-3 border-t sm:border-t-0 sm:border-l border-outline-variant pt-4 sm:pt-0 sm:pl-6">
                    <StatusBadge status={item.status} size="sm" />
                    <span className="font-body-md text-body-md text-primary">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Measurements Summary (5 cols) */}
          <div className="lg:col-span-5 offset-y-subtle flex flex-col gap-8">
            <div className="flex justify-between items-end border-b border-outline-variant pb-4">
              <h2 className="font-body-lg text-body-lg text-primary uppercase">Current Measurements</h2>
              <span className="font-label-caps text-[10px] text-secondary">FULL PROFILE</span>
            </div>

            <div className="border border-outline-variant p-8 bg-surface-container-lowest relative">
              <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-9xl">straighten</span>
              </div>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-label-caps text-label-caps text-primary uppercase">JACKET PROFILE</h3>
                  <span className="font-caption text-[10px] text-secondary">ID: 4492-A</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex justify-between border-b border-outline-variant pb-2 border-dashed">
                    <span className="font-body-md text-body-md text-secondary text-sm">Chest</span>
                    <span className="font-body-md text-body-md text-primary font-semibold">{user?.measurements?.chest || '40.5"'}</span>
                  </li>
                  <li className="flex justify-between border-b border-outline-variant pb-2 border-dashed">
                    <span className="font-body-md text-body-md text-secondary text-sm">Waist</span>
                    <span className="font-body-md text-body-md text-primary font-semibold">{user?.measurements?.waist || '34.0"'}</span>
                  </li>
                  <li className="flex justify-between border-b border-outline-variant pb-2 border-dashed">
                    <span className="font-body-md text-body-md text-secondary text-sm">Shoulder</span>
                    <span className="font-body-md text-body-md text-primary font-semibold">{user?.measurements?.shoulder || '18.5"'}</span>
                  </li>
                  <li className="flex justify-between border-b border-outline-variant pb-2 border-dashed">
                    <span className="font-body-md text-body-md text-secondary text-sm">Sleeve Length</span>
                    <span className="font-body-md text-body-md text-primary font-semibold">{user?.measurements?.sleeveLength || '25.0"'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Requests & Commissions Section */}
        <section className="mt-8">
          <div className="flex justify-between items-end border-b border-primary pb-4 mb-8">
            <h2 className="font-headline-md text-headline-md text-primary uppercase">Active & Completed Requests</h2>
            <button
              onClick={() => navigate('/bespoke')}
              className="font-label-caps text-label-caps text-primary border-b border-primary hover:border-tertiary-container transition-colors uppercase"
            >
              New Request
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {requests.map((r) => (
              <div
                key={r.id}
                onClick={() => navigate(`/account/requests/${r.id || r.referenceId}`)}
                className="p-6 border border-outline-variant bg-surface-container-lowest hover:border-primary transition-colors cursor-pointer space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-caption text-caption text-secondary block">{r.referenceId}</span>
                    <h3 className="font-headline-md text-[20px] text-primary mt-1">{r.garmentType}</h3>
                  </div>
                  <StatusBadge status={r.status} />
                </div>

                <p className="font-body-md text-sm text-secondary line-clamp-2">{r.requirements}</p>

                <div className="pt-4 border-t border-outline-variant flex justify-between items-center text-xs">
                  <span className="text-secondary font-caption">Quotation: <strong className="text-primary">{r.quotation || 'Pending'}</strong></span>
                  <span className="font-label-caps text-primary flex items-center gap-1 group">
                    View Details
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-16"></div>
      </main>
    </div>
  );
};
