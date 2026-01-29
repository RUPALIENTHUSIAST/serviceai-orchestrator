
import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { User, Role, Incident, DashboardStats } from './types';
import Login from './components/Login';
import Workspace from './components/Workspace';
import Portal from './components/Portal';

const MOCK_INCIDENTS: Incident[] = [
  {
    sys_id: '1',
    number: 'INC0010234',
    caller: 'John Smith',
    short_description: 'Issue during transactions',
    description: 'Payment gateway experiencing intermittent failures during customer transactions. Multiple reports from field agents across London and Manchester regions. Customers unable to complete online payments for new service orders. Error code PG-5001 appearing on checkout page. Affecting approximately 150 transactions per hour. Business impact is critical as customers are abandoning orders and calling support lines. Issue started at 09:30 GMT today. Payment provider Worldpay has been contacted but no response yet. Logs show timeout errors when connecting to payment API endpoint.',
    state: 'In Progress',
    priority: '1 - Critical',
    impact: '1 - Extensive/Widespread',
    urgency: '1 - High',
    assignment_group: 'Openreach Field Ops',
    assigned_to: 'Alan Davies',
    business_service: 'Payment Systems',
    cmdb_ci: 'PAY-GATEWAY-01',
    opened_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    comments: [
      { id: 'c1', text: 'Investigating transaction failures with payment provider.', author: 'Service Desk', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), isInternal: true },
      { id: 'c2', text: 'Field team dispatched to check network connectivity.', author: 'Alan Davies', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), isInternal: false }
    ]
  },
  {
    sys_id: '2',
    number: 'INC0010552',
    caller: 'John Smith',
    short_description: 'Post order technical troubleshooting',
    description: 'Business customer ABC Manufacturing Ltd (Account #BUS-45821) reporting persistent connectivity issues following fiber installation completed on 15th January. Service was provisioned as 1Gbps symmetric fiber connection but customer experiencing frequent dropouts every 2-3 hours. ONT shows solid green lights but router loses WAN connection intermittently. Customer has critical ERP system hosted on-premise that requires stable connection. Multiple departments affected including Finance, Operations, and Sales teams (approx 85 users). Engineer visited site yesterday and replaced ONT unit but issue persists. Line tests show no physical faults. Suspecting configuration issue with VLAN tagging or QoS settings. Customer becoming increasingly frustrated and threatening to escalate to account manager.',
    state: 'On Hold',
    on_hold_reason: 'Awaiting Vendor',
    priority: '2 - High',
    impact: '2 - Significant/Large',
    urgency: '2 - Medium',
    assignment_group: 'Business',
    assigned_to: 'Sarah Jenkins',
    business_service: 'Business Fiber',
    cmdb_ci: 'BUS-FIBER-9982',
    opened_at: new Date(Date.now() - 86400000).toISOString(),
    comments: []
  },
  {
    sys_id: '3',
    number: 'INC0010789',
    caller: 'John Smith',
    short_description: 'Broadband SIM problem',
    description: 'Consumer customer reporting mobile broadband SIM card (ICCID: 8944110012345678901) not connecting to network since yesterday evening. Customer using Huawei E5577 mobile WiFi device purchased 3 months ago. Device powers on normally and shows battery/WiFi indicators but displays "No Service" message. SIM card has been removed and reinserted multiple times with no success. Customer confirmed they are in an area with good 4G coverage (postcode SW1A 1AA, Central London). Account shows SIM is active and no bars or suspensions applied. Data allowance shows 45GB remaining out of 50GB monthly plan. Customer needs connection urgently as working from home and has no alternative internet access. Advised customer to try SIM in mobile phone to isolate device vs SIM issue - customer confirmed SIM also shows no service in phone. Network status page shows no outages in customer area.',
    state: 'New',
    priority: '3 - Moderate',
    impact: '3 - Moderate/Limited',
    urgency: '2 - Medium',
    assignment_group: 'Consumer',
    assigned_to: 'Unassigned',
    business_service: 'Mobile Broadband',
    cmdb_ci: 'SIM-CARD-4521',
    opened_at: new Date(Date.now() - 7200000).toISOString(),
    comments: []
  },
  {
    sys_id: '4',
    number: 'INC0010891',
    caller: 'John Smith',
    short_description: 'High latency detected APAC region',
    description: 'Multiple international business customers across APAC region (Singapore, Hong Kong, Tokyo, Sydney) reporting severely degraded performance since 06:00 GMT. Average latency increased from normal 45-60ms to 500-850ms. Packet loss observed at 3-5%. Primarily affecting customers using our MPLS and SD-WAN services for connecting branch offices to UK headquarters. Video conferencing (Teams/Zoom) experiencing frequent freezes and audio dropouts. VoIP call quality severely impacted with jitter exceeding 100ms. Critical business applications including SAP, Oracle, and Salesforce timing out. Approximately 240 enterprise customers affected across region. Traceroute analysis shows delays occurring at Singapore gateway (APAC-GATEWAY-SG). BGP routing tables appear normal. Suspecting either capacity saturation on undersea cable or routing suboptimal path through congested peer. Contacted Tata Communications (upstream provider) for investigation. Customer escalations increasing - three P1 customers have raised formal complaints. Revenue impact estimated at £50K per hour in SLA credits.',
    state: 'In Progress',
    priority: '2 - High',
    impact: '2 - Significant/Large',
    urgency: '1 - High',
    assignment_group: 'International',
    assigned_to: 'Michael Chen',
    business_service: 'International Network',
    cmdb_ci: 'APAC-GATEWAY-SG',
    opened_at: new Date(Date.now() - 10800000).toISOString(),
    comments: [
      { id: 'c3', text: 'Routing issue identified in Singapore gateway.', author: 'Michael Chen', timestamp: new Date(Date.now() - 7200000).toISOString(), isInternal: true }
    ]
  },
  {
    sys_id: 'h-1',
    number: 'INC0022981',
    caller: 'Emma Watson',
    short_description: 'Laptop Battery Swelling - MacBook Pro',
    description: 'The battery on my corporate laptop is bulging, the trackpad is hard to click. Requesting an urgent hardware swap. Device is MacBook Pro 14" M3 (Serial: C02XY1234ABC) issued 8 months ago. Battery health showing 87% in system diagnostics but physical swelling visible on bottom case. Trackpad clicks are inconsistent and require excessive force. Concerned about safety risk. Need replacement urgently as this is my primary work device. Currently working on critical Q1 financial reports deadline next week. Have backed up all data to OneDrive. Available for device swap Monday-Friday 9am-5pm at London office.',
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
    description: 'My assigned desk (4-B12) is missing the USB-C docking station. Cannot connect dual monitors. Returned from 2-week annual leave yesterday to find docking station missing from desk. Checked with nearby colleagues - no one has seen it. Need docking station to connect two Dell 27" monitors (Monitor IDs: MON-4521, MON-4522) for daily work. Currently using laptop screen only which is impacting productivity significantly. Work involves extensive Excel spreadsheets and financial modeling requiring multiple screens. Facilities team confirmed docking station was not moved for cleaning or maintenance. Suspect it may have been taken by mistake during office reorganization last week.',
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
    sys_id: 'h-3',
    number: 'INC0023567',
    caller: 'Emma Watson',
    short_description: 'VPN connection dropping frequently',
    description: 'Corporate VPN (Cisco AnyConnect) disconnecting every 15-20 minutes when working from home. Started happening 3 days ago. Home broadband connection is stable (Virgin Media 500Mbps). VPN connects successfully but drops randomly requiring manual reconnection. Affecting ability to access internal SharePoint, email, and SAP systems. Error message shows "Connection timeout" before disconnect. Have tried restarting laptop, router, and reinstalling VPN client with no improvement. Working from home 3 days per week so this is significantly impacting productivity. Colleagues on same home network provider not experiencing issues.',
    state: 'In Progress',
    priority: '3 - Moderate',
    impact: '3 - Moderate/Limited',
    urgency: '2 - Medium',
    assignment_group: 'Network Core Support',
    assigned_to: 'James Wilson',
    business_service: 'Remote Access',
    cmdb_ci: 'VPN-CLIENT-8821',
    opened_at: new Date(Date.now() - 172800000).toISOString(),
    comments: [
      { id: 'c4', text: 'Checking VPN gateway logs for connection issues.', author: 'James Wilson', timestamp: new Date(Date.now() - 86400000).toISOString(), isInternal: true }
    ]
  },
  {
    sys_id: 'h-4',
    number: 'INC0023789',
    caller: 'Emma Watson',
    short_description: 'Microsoft Teams audio not working',
    description: 'Unable to hear audio in Microsoft Teams calls since yesterday. Microphone works fine (others can hear me) but cannot hear any audio from other participants. Issue occurs in both scheduled meetings and ad-hoc calls. Tested with headphones and laptop speakers - same problem. Other applications (Spotify, YouTube) play audio normally. Teams video works perfectly, only audio affected. Have tried: signing out/in, restarting Teams, checking audio settings, updating Teams to latest version. Audio device shows as "Speakers (Realtek High Definition Audio)" in Teams settings. Critical issue as have daily team standups and client calls. Currently using phone to dial into meetings as workaround but not sustainable.',
    state: 'New',
    priority: '2 - High',
    impact: '3 - Moderate/Limited',
    urgency: '1 - High',
    assignment_group: 'Service Desk',
    assigned_to: 'Unassigned',
    business_service: 'Collaboration Tools',
    cmdb_ci: 'TEAMS-CLIENT-001',
    opened_at: new Date(Date.now() - 3600000).toISOString(),
    comments: []
  },
  {
    sys_id: '5',
    number: 'INC0010553',
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/user' && !currentUser) {
      handleLogin('end_user');
    } else if (location.pathname === '/employee' && !currentUser) {
      handleLogin('employee');
    } else if (location.pathname === '/admin' && !currentUser) {
      handleLogin('admin');
    }
  }, [location.pathname]);

  const stats: DashboardStats = useMemo(() => {
    const active = incidents.filter(i => i.state !== 'Resolved' && i.state !== 'Closed' && i.state !== 'Canceled');
    
    const teamStats = [
      'Openreach Field Ops', 'Civils Team', 'Third Party Liaison', 
      'Network Core Support', 'Hardware Support', 'Service Desk'
    ].map(teamName => ({
      teamName,
      totalAssigned: active.filter(i => i.assignment_group === teamName).length,
      resolved: incidents.filter(i => i.assignment_group === teamName && i.state === 'Resolved').length,
      inProgress: active.filter(i => i.assignment_group === teamName && i.state === 'In Progress').length,
      avgResolutionTime: 0
    }));

    return {
      totalActive: active.length,
      inJeopardy: active.filter(i => i.state === 'On Hold' || i.priority.includes('1')).length,
      p1Count: active.filter(i => i.priority.includes('1')).length,
      awaitingApproval: active.filter(i => i.state === 'On Hold' && i.on_hold_reason === 'Awaiting Vendor').length,
      unassigned: active.filter(i => i.assigned_to === 'Unassigned').length,
      critical: active.filter(i => i.priority.includes('1')).length,
      overdue: active.filter(i => i.priority.includes('1') && (Date.now() - new Date(i.opened_at).getTime() > 3600000)).length,
      resolvedToday: incidents.filter(i => i.state === 'Resolved').length,
      teamStats,
      impactBreakdown: {
        extensive: active.filter(i => i.impact === '1 - Extensive/Widespread').length,
        significant: active.filter(i => i.impact === '2 - Significant/Large').length,
        moderate: active.filter(i => i.impact === '3 - Moderate/Limited').length
      }
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

    if (role === 'end_user') navigate('/user');
    else if (role === 'employee') navigate('/employee');
    else if (role === 'admin') navigate('/admin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedIncident(null);
    setIsCreating(false);
    navigate('/');
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

  if (!currentUser && location.pathname === '/') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/user" element={
        <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden font-sans">
          <header className="h-12 bg-[#293e40] text-white flex items-center px-4 justify-between shrink-0 shadow-md z-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#5514B4] rounded flex items-center justify-center font-bold text-sm">BT</div>
              <span className="font-semibold tracking-tight">BT Support <span className="font-normal opacity-70">| Customer Portal</span></span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <button onClick={handleLogout} className="hover:text-indigo-300 transition-colors">
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          </header>
          <Portal 
            user={currentUser || { id: '1', name: 'John Smith', role: 'end_user', email: 'john.smith@openreach.co.uk' }}
            incidents={incidents.filter(i => i.caller === (currentUser?.name || 'John Smith'))} 
            onSelect={setSelectedIncident}
            onNew={handleNewIncident}
            selectedIncident={selectedIncident}
            onUpdate={updateIncident}
            onClose={() => setSelectedIncident(null)}
          />
        </div>
      } />
      <Route path="/employee" element={
        <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden font-sans">
          <header className="h-12 bg-[#293e40] text-white flex items-center px-4 justify-between shrink-0 shadow-md z-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#5514B4] rounded flex items-center justify-center font-bold text-sm">BT</div>
              <span className="font-semibold tracking-tight">BT Support <span className="font-normal opacity-70">| Employee Center</span></span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <button onClick={handleLogout} className="hover:text-indigo-300 transition-colors">
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          </header>
          <Portal 
            user={currentUser || { id: '2', name: 'Emma Watson', role: 'employee', email: 'emma.watson@openreach.co.uk' }}
            incidents={incidents.filter(i => i.caller === (currentUser?.name || 'Emma Watson'))} 
            onSelect={setSelectedIncident}
            onNew={handleNewIncident}
            selectedIncident={selectedIncident}
            onUpdate={updateIncident}
            onClose={() => setSelectedIncident(null)}
          />
        </div>
      } />
      <Route path="/admin" element={
        <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden font-sans">
          <header className="h-12 bg-[#293e40] text-white flex items-center px-4 justify-between shrink-0 shadow-md z-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#5514B4] rounded flex items-center justify-center font-bold text-sm">BT</div>
              <span className="font-semibold tracking-tight">BT Support <span className="font-normal opacity-70">| ITSM Workspace</span></span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex flex-col items-end opacity-80">
                <span className="font-bold uppercase tracking-tighter text-[9px]">Logged in as</span>
                <span>{currentUser?.name || 'Agent System Admin'} (admin)</span>
              </div>
              <button onClick={handleLogout} className="hover:text-indigo-300 transition-colors">
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          </header>
          <Workspace 
            user={currentUser || { id: '3', name: 'Agent System Admin', role: 'admin', email: 'admin@openreach.co.uk' }}
            incidents={incidents} 
            selectedIncident={selectedIncident}
            onSelect={setSelectedIncident}
            onUpdate={updateIncident}
            onNew={handleNewIncident}
            stats={stats}
          />
        </div>
      } />
    </Routes>
  );
};

export default App;
