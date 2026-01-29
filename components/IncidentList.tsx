
import React, { useState } from 'react';
import { Incident } from '../types';
import StatusBadge from './StatusBadge';

interface Props {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

const IncidentList: React.FC<Props> = ({ incidents, onSelectIncident }) => {
  const [filter, setFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredIncidents = incidents.filter(inc => {
    const matchesText = inc.number.toLowerCase().includes(filter.toLowerCase()) || 
                       inc.short_description.toLowerCase().includes(filter.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || inc.priority === priorityFilter;
    return matchesText && matchesPriority;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Operational Incident Queue</h2>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input 
              type="text" 
              placeholder="Search ID or Summary..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="P1">P1 - Critical</option>
            <option value="P2">P2 - High</option>
            <option value="P3">P3 - Moderate</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
              <th className="px-6 py-4">Number</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Short Description</th>
              <th className="px-6 py-4">Assignment</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredIncidents.map((inc) => (
              <tr 
                key={inc.number} 
                className="hover:bg-slate-50 cursor-pointer transition-all group"
                onClick={() => onSelectIncident(inc)}
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-indigo-600 group-hover:underline underline-offset-4 decoration-indigo-300">
                    {inc.number}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={inc.state} />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-700">{inc.short_description}</div>
                  {/* Fixed: business_service is defined in Incident type, not service */}
                  <div className="text-xs text-slate-400">{inc.business_service}</div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                       OR
                     </div>
                     <span className="text-xs text-slate-600">Openreach Field Ops</span>
                   </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={inc.priority} type="priority" />
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {/* Fixed: opened_at is the correct date field in Incident type */}
                  {inc.opened_at ? new Date(inc.opened_at).toLocaleDateString() : 'Just now'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs text-slate-500">Showing {filteredIncidents.length} of {incidents.length} records</span>
        <div className="flex gap-2">
           <button className="px-3 py-1 rounded border border-slate-300 bg-white text-xs font-medium text-slate-600 disabled:opacity-50">Prev</button>
           <button className="px-3 py-1 rounded border border-slate-300 bg-white text-xs font-medium text-slate-600 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default IncidentList;
