
import React from 'react';
import { OrchestrationResponse } from '../types';
import StatusBadge from './StatusBadge';

interface Props {
  data: OrchestrationResponse;
}

const OrchestrationDashboard: React.FC<Props> = ({ data }) => {
  const { incident, workflowState, slaStatus, tasks, approvalsAndDependencies, workNotes, configurationItems, recommendedNextActions } = data;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{incident.number}</h1>
              <StatusBadge status={incident.state} />
              <StatusBadge status={incident.priority} type="priority" />
              {slaStatus.isJeopardy && (
                 <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white border border-red-700 animate-pulse">
                   <i className="fa-solid fa-triangle-exclamation"></i> JEOPARDY
                 </span>
              )}
            </div>
            <p className="text-slate-600 font-medium">{incident.shortDescription}</p>
          </div>
          <div className="text-right">
             <div className="text-sm text-slate-500 mb-1">Service</div>
             <div className="font-semibold text-slate-800">{incident.service}</div>
             <div className="text-xs text-slate-400">{incident.affectedServiceType}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Current Phase</div>
            <div className="text-sm font-bold text-indigo-600 flex items-center gap-2">
              <i className="fa-solid fa-arrows-spin fa-spin-slow"></i>
              {workflowState.currentPhase}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Sub-Status</div>
            <div className="text-sm text-slate-700 font-medium">{incident.subState}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Fault Cause</div>
            <div className="text-sm text-slate-700 font-medium">{incident.faultCause}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase mb-1">SLA Health</div>
            <div className="flex items-center gap-2">
              <StatusBadge status={slaStatus.slaHealth} type="health" />
            </div>
          </div>
        </div>
      </div>

      {/* SLA & Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Work Notes */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-notes-medical text-indigo-500"></i>
                Operational Work Notes
              </h2>
              <span className="text-xs text-slate-500">{workNotes.length} Entries</span>
            </div>
            <div className="p-5 max-h-[400px] overflow-y-auto space-y-4">
              {workNotes.map((note, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg border-l-4 border-indigo-400 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {note}
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-list-check text-indigo-500"></i>
                Inferred Workflow Tasks
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-xs font-bold text-slate-500 uppercase">
                    <th className="px-5 py-3 border-b">Task Type</th>
                    <th className="px-5 py-3 border-b">Assignment Group</th>
                    <th className="px-5 py-3 border-b">Status</th>
                    <th className="px-5 py-3 border-b">Blockers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.map((task, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">{task.taskType}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{task.assignmentGroup}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={task.state} />
                      </td>
                      <td className="px-5 py-4 text-sm text-red-500 font-medium">
                        {task.blockingReason || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          {/* SLA Timer */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm bg-gradient-to-br from-slate-50 to-white">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center justify-between">
              SLA Countdown
              <i className="fa-solid fa-clock-rotate-left"></i>
            </h3>
            <div className="space-y-4">
               <div>
                 <div className="text-xs text-slate-500 mb-1">Target Completion</div>
                 <div className="text-lg font-bold text-slate-800">
                   {new Date(slaStatus.estimatedCompletionDateTime).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                 </div>
               </div>
               <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-1000 ${slaStatus.slaHealth === 'Breached' ? 'bg-red-500' : slaStatus.slaHealth === 'At Risk' ? 'bg-yellow-500' : 'bg-green-500'}`} 
                    style={{ width: '85%' }}
                  ></div>
               </div>
               <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                 <span>Started: {new Date(slaStatus.startDateTime).toLocaleTimeString()}</span>
                 <span>85% Expired</span>
               </div>
            </div>
          </div>

          {/* Next Actions */}
          <div className="bg-indigo-900 text-white border border-indigo-950 rounded-xl p-5 shadow-lg">
            <h3 className="text-xs font-bold text-indigo-300 uppercase mb-4 flex items-center gap-2">
              <i className="fa-solid fa-bolt-lightning"></i>
              Next Actions
            </h3>
            <ul className="space-y-3">
              {recommendedNextActions.map((action, idx) => (
                <li key={idx} className="flex gap-3 text-sm group">
                  <div className="w-5 h-5 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0 text-[10px] group-hover:bg-indigo-500 transition-colors">
                    {idx + 1}
                  </div>
                  <span className="text-indigo-50 leading-tight">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Configuration Items */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Affected CI List</h3>
            <div className="space-y-2">
              {configurationItems.map((ci, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded border border-slate-100 text-xs font-mono text-slate-600 hover:border-indigo-200 transition-colors cursor-pointer">
                  <i className="fa-solid fa-server text-indigo-400"></i>
                  {ci}
                </div>
              ))}
            </div>
          </div>

          {/* Approvals */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Approvals & Dependencies</h3>
            <div className="space-y-3">
              {approvalsAndDependencies.map((app, idx) => (
                <div key={idx} className="flex flex-col gap-1 border-b border-slate-50 pb-2 last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">{app.type}</span>
                    <span className={`text-[10px] font-bold uppercase ${app.status === 'Requested' ? 'text-blue-600' : 'text-slate-400'}`}>{app.status}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Group: {app.ownerGroup}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrchestrationDashboard;
