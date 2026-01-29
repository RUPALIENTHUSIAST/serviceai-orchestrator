
import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'state' | 'priority' | 'health';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'state' }) => {
  const getStyles = () => {
    const s = status.toLowerCase();
    
    if (type === 'priority') {
      if (s === 'p1') return 'bg-red-100 text-red-800 border-red-200';
      if (s === 'p2') return 'bg-orange-100 text-orange-800 border-orange-200';
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }

    if (type === 'health') {
      if (s === 'breached') return 'bg-red-100 text-red-800 border-red-200';
      if (s === 'at risk') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      return 'bg-green-100 text-green-800 border-green-200';
    }

    // Default state styles
    if (s.includes('hold') || s.includes('jeopardy')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (s.includes('progress')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (s.includes('resolved') || s.includes('closed')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyles()} uppercase tracking-wider`}>
      {status}
    </span>
  );
};

export default StatusBadge;
