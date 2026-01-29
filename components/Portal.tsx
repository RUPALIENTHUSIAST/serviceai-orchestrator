
import React, { useState } from 'react';
import { Incident, User } from '../types';
import StatusBadge from './StatusBadge';
import IncidentForm from './IncidentForm';
import Chatbot from './Chatbot';

interface Props {
  user: User;
  incidents: Incident[];
  onSelect: (inc: Incident) => void;
  onNew: () => void;
  selectedIncident: Incident | null;
  onUpdate: (inc: Incident) => void;
  onClose: () => void;
}

type PortalView = 'dashboard' | 'catalog' | 'kb';

const Portal: React.FC<Props> = ({ user, incidents, onSelect, onNew, selectedIncident, onUpdate, onClose }) => {
  const [activeView, setActiveView] = useState<PortalView>('dashboard');

  if (selectedIncident) {
    return (
      <div className="flex-1 overflow-hidden flex flex-col bg-white">
        <IncidentForm 
          incident={selectedIncident} 
          onClose={onClose} 
          onUpdate={onUpdate}
          user={user}
        />
      </div>
    );
  }

  const isEmployee = user.role === 'employee';

  const employeeCatalog = [
    { id: 'h1', title: 'MacBook Pro 14" (M3)', desc: 'Standard developer workstation upgrade.', icon: 'fa-laptop' },
    { id: 'h2', title: 'Ergonomic Desk Chair', desc: 'Request a health-assessed office chair.', icon: 'fa-chair' },
    { id: 'h3', title: 'VPN Access Token', desc: 'Secure remote access for off-site work.', icon: 'fa-key' },
    { id: 'h4', title: 'Mobile Handset', desc: 'Corporate iPhone or Android device.', icon: 'fa-mobile-screen' },
  ];

  const userCatalog = [
    { id: 's1', title: 'Full Fiber Upgrade', desc: 'Upgrade to faster broadband speeds', icon: 'fa-bolt', color: 'blue' },
    { id: 's2', title: 'Static IP Address', desc: 'Request dedicated IP for business', icon: 'fa-network-wired', color: 'indigo' },
    { id: 's3', title: 'Wi-Fi Extender', desc: 'Improve coverage in your premises', icon: 'fa-wifi', color: 'purple' },
    { id: 's4', title: 'Priority Support', desc: '24/7 priority fault resolution', icon: 'fa-shield-heart', color: 'green' },
    { id: 's5', title: 'Business Line', desc: 'Add additional business broadband line', icon: 'fa-building', color: 'orange' },
    { id: 's6', title: 'Engineer Visit', desc: 'Schedule on-site engineer assessment', icon: 'fa-user-gear', color: 'emerald' },
  ];

  const employeeKB = [
    { id: 'k1', title: 'Connecting to Corporate Wi-Fi', category: 'IT Support' },
    { id: 'k2', title: 'How to file Travel Expenses', category: 'Finance' },
    { id: 'k3', title: 'Booking Hybrid Meeting Rooms', category: 'Facilities' },
    { id: 'k4', title: 'Mental Health Resources 2024', category: 'HR' },
  ];

  const userKB = [
    { id: 'u1', title: 'Restarting your Openreach ONT', category: 'Troubleshooting' },
    { id: 'u2', title: 'What do the lights on my hub mean?', category: 'Setup' },
    { id: 'u3', title: 'Testing your Fiber line speed', category: 'Performance' },
    { id: 'u4', title: 'Moving home checklist', category: 'Account' },
  ];

  const renderCatalog = () => (
    <div className="max-w-4xl mx-auto py-8">
      <button onClick={() => setActiveView('dashboard')} className="mb-6 text-sm font-bold text-indigo-600 flex items-center gap-2">
        <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
      </button>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">{isEmployee ? "Hardware & Equipment Catalog" : "Service Catalog"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(isEmployee ? employeeCatalog : userCatalog).map(item => (
          <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-lg bg-${item.color || 'indigo'}-50 text-${item.color || 'indigo'}-600 flex items-center justify-center shrink-0`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">{item.title}</h3>
              <p className="text-xs text-slate-500 mb-3">{item.desc}</p>
              <button onClick={onNew} className="text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors">
                {item.id === 's8' ? 'Browse Articles' : 'Create Request'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderKB = () => (
    <div className="max-w-4xl mx-auto py-8">
      <button onClick={() => setActiveView('dashboard')} className="mb-6 text-sm font-bold text-indigo-600 flex items-center gap-2">
        <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
      </button>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Knowledge Base</h2>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {(isEmployee ? employeeKB : userKB).map(article => (
          <div key={article.id} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors flex justify-between items-center group">
            <div>
              <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{article.title}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{article.category}</div>
            </div>
            <i className="fa-solid fa-chevron-right text-xs text-slate-300"></i>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-4 md:p-6">
      <Chatbot />
      {activeView === 'catalog' && renderCatalog()}
      {activeView === 'kb' && renderKB()}
      
      {activeView === 'dashboard' && (
        <div className="max-w-4xl mx-auto py-6 md:py-12">
          <div className="mb-8 md:mb-10 text-center px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-[#293e40] mb-2">
              Welcome!
            </h1>
            <p className="text-sm md:text-base text-slate-500">
              {isEmployee ? "Employee Center - Manage your workplace needs." : "How can we help you with your services today?"}
            </p>
            <div className="mt-6 max-w-xl mx-auto relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder={isEmployee ? "Search hardware, desk docks, VPN help..." : "Search for fiber help, broadband articles..."} 
                className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-base transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
            {isEmployee ? (
              <>
                <button 
                  onClick={onNew}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-red-50 text-red-600">
                    <i className="fa-solid fa-laptop"></i>
                  </div>
                  <span className="font-bold text-xs text-slate-800">IT Support</span>
                </button>
                
                <button 
                  onClick={onNew}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-blue-50 text-blue-600">
                    <i className="fa-solid fa-box"></i>
                  </div>
                  <span className="font-bold text-xs text-slate-800">Equipment</span>
                </button>

                <button 
                  onClick={onNew}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-purple-50 text-purple-600">
                    <i className="fa-solid fa-key"></i>
                  </div>
                  <span className="font-bold text-xs text-slate-800">Access Request</span>
                </button>

                <button 
                  onClick={onNew}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-orange-50 text-orange-600">
                    <i className="fa-solid fa-mobile-screen"></i>
                  </div>
                  <span className="font-bold text-xs text-slate-800">Mobile Device</span>
                </button>

                <button 
                  onClick={onNew}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-green-50 text-green-600">
                    <i className="fa-solid fa-building"></i>
                  </div>
                  <span className="font-bold text-xs text-slate-800">Facilities</span>
                </button>

                <button 
                  onClick={onNew}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-indigo-50 text-indigo-600">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <span className="font-bold text-xs text-slate-800">HR Request</span>
                </button>

                <button 
                  onClick={onNew}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-yellow-50 text-yellow-600">
                    <i className="fa-solid fa-plane"></i>
                  </div>
                  <span className="font-bold text-xs text-slate-800">Travel</span>
                </button>

                <button 
                  onClick={() => setActiveView('kb')}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-emerald-50 text-emerald-600">
                    <i className="fa-solid fa-book"></i>
                  </div>
                  <span className="font-bold text-xs text-slate-800">Knowledge Base</span>
                </button>
              </>
            ) : (
              <>
            <button 
              onClick={onNew}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-red-50 text-red-600">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <span className="font-bold text-xs text-slate-800">Report Outage</span>
            </button>
            
            <button 
              onClick={onNew}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-blue-50 text-blue-600">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <span className="font-bold text-xs text-slate-800">Fibre Issues</span>
            </button>

            <button 
              onClick={onNew}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-orange-50 text-orange-600">
                <i className="fa-solid fa-router"></i>
              </div>
              <span className="font-bold text-xs text-slate-800">Hardware</span>
            </button>

            <button 
              onClick={onNew}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-purple-50 text-purple-600">
                <i className="fa-solid fa-laptop-code"></i>
              </div>
              <span className="font-bold text-xs text-slate-800">Software</span>
            </button>

            <button 
              onClick={onNew}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-indigo-50 text-indigo-600">
                <i className="fa-solid fa-building"></i>
              </div>
              <span className="font-bold text-xs text-slate-800">Broadband</span>
            </button>

            <button 
              onClick={onNew}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-green-50 text-green-600">
                <i className="fa-solid fa-user-gear"></i>
              </div>
              <span className="font-bold text-xs text-slate-800">Field Agent</span>
            </button>

            <button 
              onClick={onNew}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-slate-50 text-slate-600">
                <i className="fa-solid fa-user-circle"></i>
              </div>
              <span className="font-bold text-xs text-slate-800">Account</span>
            </button>

              </>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-800">My Recent Requests</h2>
              <button className="text-sm font-bold text-indigo-600">View History</button>
            </div>
            {incidents.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {incidents.map(inc => (
                  <div 
                    key={inc.sys_id} 
                    className="p-4 md:p-6 hover:bg-slate-50 cursor-pointer transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    onClick={() => onSelect(inc)}
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-indigo-600">{inc.number}</div>
                      <div className="text-sm font-semibold text-slate-800">{inc.short_description}</div>
                      <div className="text-[10px] text-slate-400">Opened: {new Date(inc.opened_at).toLocaleDateString()}</div>
                    </div>
                    <StatusBadge status={inc.state} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 italic text-sm">
                You have no active requests.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Portal;
