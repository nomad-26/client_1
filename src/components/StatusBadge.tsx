import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyle = () => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary-container';
      case 'quote sent':
      case 'contacted':
        return 'bg-surface-variant text-on-surface-variant border-outline';
      case 'confirmed':
        return 'bg-primary text-on-primary border-primary';
      case 'in progress':
        return 'bg-outline text-on-primary border-outline';
      case 'ready':
      case 'completed':
        return 'bg-tertiary-container text-on-tertiary-container border-tertiary-container';
      case 'pending':
        return 'bg-surface-container-low text-secondary border-outline-variant';
      case 'cancelled':
      case 'archived':
        return 'bg-error-container text-on-error-container border-error';
      default:
        return 'bg-surface-variant text-on-surface border-outline-variant';
    }
  };

  const pxClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]';

  return (
    <span className={`inline-block font-label-caps tracking-widest uppercase border ${pxClass} ${getStyle()}`}>
      {status}
    </span>
  );
};
