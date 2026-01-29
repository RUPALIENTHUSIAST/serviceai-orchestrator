
import React from 'react';
import { DashboardStats, Incident } from '../types';
import StatusBadge from './StatusBadge';

interface Props {
  stats: DashboardStats;
  recentIncidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

const DashboardOverview: React.FC<Props> = ({ stats, recentIncidents, onSelectIncident }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Active', value: stats.totalActive, icon: 'fa-ticket', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'At Risk / Jeopardy', value: stats.inJeopardy, icon: 'fa-triangle-exclamation', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'P1 Critical', value: stats.p1Count, icon: 'fa-fire-flame-curved', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
          { label: 'Unassigned', value: stats.unassigned, icon: 'fa-user-clock', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        ].map((card, i) => (
          <div key={i} className={`bg-white p-5 rounded-2xl border ${card.border} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-center mb-4">
              <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center text-xl`}>
                <i className={`fa-solid ${card.icon}`}></i>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Real-Time</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-1"></span>
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{card.value}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-tight">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Team Stats */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-users text-purple-500"></i>
            Team Performance
          </h3>
          <div className="space-y-3">
            {stats.teamStats.map((team, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded border border-slate-100">
                <div className="text-xs font-bold text-slate-700">{team.teamName}</div>
                <div className="flex gap-4 mt-2 text-[10px]">
                  <span className="text-slate-500">Assigned: <strong>{team.totalAssigned}</strong></span>
                  <span className="text-green-600">Resolved: <strong>{team.resolved}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-orange-500"></i>
            Impact Distribution
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Extensive/Widespread', value: stats.impactBreakdown.extensive, color: 'bg-red-500' },
              { label: 'Significant/Large', value: stats.impactBreakdown.significant, color: 'bg-orange-500' },
              { label: 'Moderate/Limited', value: stats.impactBreakdown.moderate, color: 'bg-yellow-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.value / stats.totalActive * 100) || 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <i className="fa-solid fa-list-ul text-indigo-500"></i>
               High Impact Queue
            </h3>
            <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">Live View</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Incident ID</th>
                  <th className="px-6 py-4">Service Detail</th>
                  <th className="px-6 py-4">Impact</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentIncidents.map((inc) => (
                  <tr 
                    key={inc.sys_id} 
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    onClick={() => onSelectIncident(inc)}
                  >
                    <td className="px-6 py-5 text-xs font-bold text-indigo-600 group-hover:underline">{inc.number}</td>
                    <td className="px-6 py-5">
                      <div className="text-xs font-semibold text-slate-700 truncate max-w-[240px]">{inc.short_description}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{inc.business_service}</div>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={inc.priority} type="priority" />
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={inc.state} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentIncidents.length === 0 && (
              <div className="p-12 text-center text-slate-300 italic text-sm">No high impact incidents recorded.</div>
            )}
          </div>
        </div>
      </div>

      {/* Node Volume Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <i className="fa-solid fa-layer-group text-emerald-500"></i>
          Node Volume
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Fiber Core (LON)', val: 65, color: 'bg-indigo-500' },
            { label: 'Copper Access (MAN)', val: 24, color: 'bg-blue-400' },
            { label: 'Exchange (BRS)', val: 8, color: 'bg-slate-400' },
            { label: 'Cloud GW (BHM)', val: 3, color: 'bg-emerald-400' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tighter">
                <span>{item.label}</span>
                <span>{item.val}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-6">
          <div className="flex-1">
            <div className="text-2xl font-black text-slate-900">99.2%</div>
            <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-tight">SLA On Track</div>
          </div>
          <div className="w-px h-10 bg-slate-200"></div>
          <div className="flex-1">
            <div className="text-2xl font-black text-slate-900">{stats.resolvedToday}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Resolved Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
