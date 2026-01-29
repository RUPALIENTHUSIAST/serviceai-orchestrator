
import React, { useState, useMemo } from 'react';
import { User, Role, Incident, DashboardStats } from './types';
import Login from './components/Login';
import Workspace from './components/Workspace';
import Portal from './components/Portal';

const MOCK_INCIDENTS: Incident[] = [
  {
    sys_id: '1',
    number: 'INC0010234',
    caller: 'John Smith',
    short_description: 'Total Fiber outage in Ealing Broadway',
    description: 'Multiple customers reporting Red LOS light on ONT. Likely duct damage near exchange node EAL-04.',
    state: 'In Progress',
    priority: '1 - Critical',
    impact: '1 - Extensive/Widespread',
    urgency: '1 - High',
    assignment_group: 'Openreach Field Ops',
    assigned_to: 'Alan Davies',
    business_service: 'Openreach Fiber (FTTP)',
    cmdb_ci: 'EAL-04-FIBER-RACK',
    opened_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    comments: [
      { id: 'c1', text: 'Assigning to Field Ops for urgent site survey.', author: 'Service Desk', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), isInternal: true },
      { id: 'c2', text: 'Engineer dispatched to Ealing Broadway exchange.', author: 'Alan Davies', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), isInternal: false }
    ]
  },
  {
    sys_id: 'h-1',
    number: 'INC0022981',
    caller: 'Emma Watson',
    short_description: 'Laptop Battery Swelling - MacBook Pro',
    description: 'The battery on my corporate laptop is bulging, the trackpad is hard to click. Requesting an urgent hardware swap.',
    state: 'New',
    priority: '2 - High',
    impact: '3 - Moderate/Limited',
    urgency: '2 - Medium',
    assignment_group: 'Hardware Support',
    assigned_to: 'Unassigned',
    business_service: 'End User Computing',
    cmdb_ci: 'LAPTOP-WATSON-01',
    opened_at: new Date(Date.now() - 1800000).toISOString(),
    comments: []
  },
  {
    sys_id: 'h-2',
    number: 'INC0023440',
    caller: 'Emma Watson',
    short_description: 'Missing Desk Docking Station - Floor 4',
    description: 'My assigned desk (4-B12) is missing the USB-C docking station. Cannot connect dual monitors.',
    state: 'Resolved',
    priority: '4 - Low',
    impact: '3 - Moderate/Limited',
    urgency: '3 - Low',
    assignment_group: 'Facilities IT',
    assigned_to: 'Mark Evans',
    business_service: 'Workplace Services',
    cmdb_ci: 'DOCK-FLOOR4-12',
    opened_at: new Date(Date.now() - 86400000).toISOString(),
    comments: []
  },
  {
    sys_id: '2',
    number: 'INC0010552',
    caller: 'Sarah Jenkins',
    short_description: 'Slow GEA Ethernet throughput',
    description: 'Corporate customer reporting only 10% of committed bandwidth on GEA circuit AF-IE-9982.',
    state: 'On Hold',
    on_hold_reason: 'Awaiting Vendor',
    priority: '2 - High',
    impact: '2 - Significant/Large',
    urgency: '2 - Medium',
    assignment_group: 'Network Core Support',
    assigned_to: 'Unassigned',
    business_service: 'Wholesale Ethernet',
    cmdb_ci: 'LON-CORE-SW-02',
    opened_at: new Date(Date.now() - 86400000).toISOString(),
    comments: []
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const stats: DashboardStats = useMemo(() => {
    const active = incidents.filter(i => i.state !== 'Resolved' && i.state !== 'Closed' && i.state !== 'Canceled');
    return {
      totalActive: active.length,
      inJeopardy: active.filter(i => i.state === 'On Hold' || i.priority.includes('1')).length,
      p1Count: active.filter(i => i.priority.includes('1')).length,
      awaitingApproval: active.filter(i => i.state === 'On Hold' && i.on_hold_reason === 'Awaiting Vendor').length,
      unassigned: active.filter(i => i.assigned_to === 'Unassigned').length,
      critical: active.filter(i => i.priority.includes('1')).length,
      overdue: active.filter(i => i.priority.includes('1') && (Date.now() - new Date(i.opened_at).getTime() > 3600000)).length,
      resolvedToday: incidents.filter(i => i.state === 'Resolved').length
    };
  }, [incidents]);

  const handleLogin = (role: Role) => {
    let name = 'User';
    if (role === 'admin') name = 'Agent System Admin';
    if (role === 'employee') name = 'Emma Watson';
    if (role === 'end_user') name = 'John Smith';

    setCurrentUser({
      id: Math.random().toString(36).substring(7),
      name: name,
      role: role,
      email: `${name.toLowerCase().replace(' ', '.')}@openreach.co.uk`
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedIncident(null);
    setIsCreating(false);
  };

  const handleNewIncident = () => {
    const newInc: Incident = {
      sys_id: Math.random().toString(36).substring(7),
      number: `INC${Math.floor(1000000 + Math.random() * 9000000)}`,
      caller: currentUser?.name || '',
      short_description: '',
      description: '',
      state: 'New',
      priority: '3 - Moderate',
      impact: '3 - Moderate/Limited',
      urgency: '2 - Medium',
      assignment_group: currentUser?.role === 'admin' ? 'Service Desk' : 'Unassigned',
      assigned_to: 'Unassigned',
      business_service: currentUser?.role === 'employee' ? 'End User Computing' : 'Customer Fiber Services',
      cmdb_ci: 'Unassigned',
      comments: [],
      opened_at: new Date().toISOString(),
    };
    setSelectedIncident(newInc);
    setIsCreating(true);
  };

  const updateIncident = (updatedInc: Incident) => {
    if (isCreating) {
      setIncidents(prev => [updatedInc, ...prev]);
      setIsCreating(false);
    } else {
      setIncidents(prev => prev.map(inc => inc.sys_id === updatedInc.sys_id ? updatedInc : inc));
    }
    setSelectedIncident(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden font-sans">
      <header className="h-12 bg-[#293e40] text-white flex items-center px-4 justify-between shrink-0 shadow-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center font-bold text-lg">s</div>
          <span className="font-semibold tracking-tight">ServiceNow <span className="font-normal opacity-70">| {currentUser.role === 'admin' ? 'ITSM Workspace' : 'Employee Center'}</span></span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex flex-col items-end opacity-80">
            <span className="font-bold uppercase tracking-tighter text-[9px]">Logged in as</span>
            <span>{currentUser.name} ({currentUser.role.replace('_', ' ')})</span>
          </div>
          <button onClick={handleLogout} className="hover:text-indigo-300 transition-colors">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </header>

      {currentUser.role === 'admin' ? (
        <Workspace 
          user={currentUser}
          incidents={incidents} 
          selectedIncident={selectedIncident}
          onSelect={setSelectedIncident}
          onUpdate={updateIncident}
          onNew={handleNewIncident}
          stats={stats}
        />
      ) : (
        <Portal 
          user={currentUser}
          incidents={incidents.filter(i => i.caller === currentUser.name)} 
          onSelect={setSelectedIncident}
          onNew={handleNewIncident}
          selectedIncident={selectedIncident}
          onUpdate={updateIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
};

export default App;
