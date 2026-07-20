import React from 'react';

// Optional: Define a status configuration for badge colors
const STATUS_STYLES = {
  active: 'bg-green-50 text-green-600',
  'in progress': 'bg-amber-50 text-amber-600',
  inactive: 'bg-neutral-100 text-neutral-600',
};
const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case 'draft':
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200/60',
        dot: 'bg-slate-400'
      };
    case 'signed':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dot: 'bg-emerald-500'
      };
    case 'in progress':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
        dot: 'bg-amber-500 animate-pulse' // Added a subtle pulse for active work
      };
    case 'expired':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
        dot: 'bg-rose-500'
      };
    default:
      return {
        bg: 'bg-gray-50 text-gray-600 border-gray-200',
        dot: 'bg-gray-400'
      };
  }
};

// Inside your JSX:
const styles = getStatusStyles(status);


export default function UserTableRow({ title, id , contractType, contractStartDate, contractEndDate, counterpartyName, status ,onEdit }) {
  // Normalize status text for CSS lookups safely
  const badgeClass = STATUS_STYLES[status] || STATUS_STYLES.inactive;

  return (
    <tr className="hover:bg-neutral-50 transition-colors">
      <td className="px-6 py-4 font-medium text-neutral-950">
        {title}
      </td>
      <td className="px-6 py-4 text-neutral-600">
        {id}
      </td>
      <td className="px-6 py-4 text-neutral-600">
        {contractType}
      </td>
      <td className="px-6 py-4 text-neutral-600">
        {contractStartDate}
      </td>
      <td className="px-6 py-4 text-neutral-600">
        {contractEndDate}
      </td>
      <td className="px-6 py-4 text-neutral-600">
        {counterpartyName}
      </td>
      <td className="px-6 py-4">
      <span className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize tracking-wide shadow-sm ${styles.bg} w-24 transition-all duration-200`}>
        <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
        {status}
      </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button 
          onClick={onEdit} 
          className="font-medium text-blue-600 hover:underline bg-transparent border-none cursor-pointer"
        >
          Edit
        </button>
      </td>
    </tr>
  );
}