
import React, { useState } from 'react';
import { Incident, DashboardStats, User } from '../types';
import StatusBadge from './StatusBadge';
import IncidentForm from './IncidentForm';
import DashboardOverview from './DashboardOverview';

interface Props {
  user: User;
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelect: (inc: Incident | null) => void;
  onUpdate: (inc: Incident) => void;
  onNew: () => void;
  stats: DashboardStats;
}

const Workspace: React.FC<Props> = ({ user, incidents, selectedIncident, onSelect, onUpdate, onNew, stats }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'all' | 'unassigned' | 'critical'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredIncidents = incidents.filter(inc => {
    if (activeView === 'resolved') {
      return inc.state === 'Resolved' || inc.state === 'Closed';
    }
    if (inc.state === 'Resolved' || inc.state === 'Closed' || inc.state === 'Canceled') {
      if (activeView !== 'all') return false;
    }
    if (activeView === 'unassigned') return inc.assigned_to === 'Unassigned';
    if (activeView === 'critical') return inc.priority.includes('1');
    return true;
  });

  if (selectedIncident) {
    return (
      <IncidentForm 
        incident={selectedIncident} 
        onClose={() => onSelect(null)} 
        onUpdate={onUpdate}
        user={user}
      />
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden relative">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95"
      >
        <i className={`fa-solid ${sidebarOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
      </button>

      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:relative z-40 w-64 h-full bg-[#f3f3f3] border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-300 ease-in-out
      `}>
        <div className="p-4 flex-1">
          <div className="relative mb-6">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="Filter Navigator" 
              className="w-full bg-white border border-slate-300 rounded text-xs py-2 pl-8 pr-2 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 tracking-widest opacity-60">Analytics</div>
              <button 
                onClick={() => { setActiveView('dashboard'); onSelect(null); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs transition-colors ${activeView === 'dashboard' ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-100' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                <i className="fa-solid fa-chart-line"></i>
                Service Dashboard
              </button>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 tracking-widest opacity-60">Incident Management</div>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'Incidents - All', icon: 'fa-ticket' },
                  { id: 'unassigned', label: 'Unassigned', icon: 'fa-user-clock' },
                  { id: 'critical', label: 'Critical Overdue', icon: 'fa-fire' },
                  { id: 'resolved', label: 'Resolved', icon: 'fa-check-circle' },
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => { setActiveView(item.id as any); onSelect(null); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition-colors ${activeView === item.id ? 'bg-[#dae6e7] text-[#293e40] font-bold' : 'text-slate-600 hover:bg-slate-200'}`}
                  >
                    <i className={`fa-solid ${item.icon} opacity-70 w-4 text-center`}></i>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 bg-white overflow-hidden flex flex-col">
        <div className="flex flex-col h-full">
          <div className="h-14 border-b border-slate-200 flex items-center px-4 md:px-6 justify-between shrink-0 bg-white shadow-sm z-10">
            <h1 className="text-sm md:text-lg font-bold text-slate-800 capitalize">
              {activeView === 'dashboard' ? 'Assurance Executive Overview' : activeView + ' Incidents'}
            </h1>
          </div>

          <div className="flex-1 overflow-auto bg-slate-50/50">
            {activeView === 'dashboard' ? (
              <div className="p-4 md:p-8 max-w-6xl mx-auto">
                <DashboardOverview 
                  stats={stats} 
                  recentIncidents={incidents.filter(i => {
                    const isActive = i.state !== 'Resolved' && i.state !== 'Closed' && i.state !== 'Canceled';
                    return isActive && (i.priority.includes('1') || i.state === 'In Progress');
                  }).slice(0, 5)}
                  onSelectIncident={onSelect}
                />
              </div>
            ) : (
              <table className="w-full text-left border-collapse bg-white">
                <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200">
                  <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="px-3 md:px-6 py-4 w-24 md:w-32">Number</th>
                    <th className="px-3 md:px-6 py-4">Summary</th>
                    <th className="px-3 md:px-6 py-4 w-24 md:w-32 hidden sm:table-cell">State</th>
                    <th className="px-3 md:px-6 py-4 w-24 md:w-32 text-center">Priority</th>
                    <th className="px-3 md:px-6 py-4 w-32 md:w-40 hidden lg:table-cell">Assigned To</th>
                    <th className="px-3 md:px-6 py-4 w-32 md:w-48 hidden xl:table-cell text-right">Opened</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredIncidents.map(inc => (
                    <tr 
                      key={inc.sys_id}
                      onClick={() => onSelect(inc)}
                      className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                    >
                      <td className="px-3 md:px-6 py-5 text-[10px] md:text-xs font-bold text-indigo-600 group-hover:underline">{inc.number}</td>
                      <td className="px-3 md:px-6 py-5">
                        <div className="text-[10px] md:text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-900 transition-colors">{inc.short_description}</div>
                        <div className="text-[9px] md:text-[10px] text-slate-400 font-mono uppercase mt-1">{inc.cmdb_ci || 'No CI Associated'}</div>
                      </td>
                      <td className="px-3 md:px-6 py-5 hidden sm:table-cell"><StatusBadge status={inc.state} /></td>
                      <td className="px-3 md:px-6 py-5 text-center"><StatusBadge status={inc.priority} type="priority" /></td>
                      <td className="px-3 md:px-6 py-5 text-[10px] md:text-[11px] text-slate-600 hidden lg:table-cell">{inc.assigned_to}</td>
                      <td className="px-3 md:px-6 py-5 text-[9px] md:text-[10px] text-slate-400 hidden xl:table-cell text-right">{new Date(inc.opened_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Workspace;
