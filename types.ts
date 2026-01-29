
export type Role = 'end_user' | 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar?: string;
}

export type IncidentState = 'New' | 'In Progress' | 'On Hold' | 'Resolved' | 'Closed' | 'Canceled';
export type OnHoldReason = 'Awaiting Caller' | 'Awaiting Vendor' | 'Awaiting Evidence' | '';
export type Priority = '1 - Critical' | '2 - High' | '3 - Moderate' | '4 - Low';
export type Impact = '1 - Extensive/Widespread' | '2 - Significant/Large' | '3 - Moderate/Limited';
export type Urgency = '1 - High' | '2 - Medium' | '3 - Low';

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  isInternal: boolean; // Work Notes vs Additional Comments
}

export interface ConfigurationItem {
  id: string;
  name: string;
  class: string;
  status: string;
  assignedTo?: string;
}

export interface Incident {
  sys_id: string;
  number: string;
  caller: string;
  short_description: string;
  description: string;
  state: IncidentState;
  on_hold_reason?: OnHoldReason;
  priority: Priority;
  impact: Impact;
  urgency: Urgency;
  assignment_group: string;
  assigned_to: string;
  business_service: string;
  cmdb_ci: string;
  comments: Comment[];
  opened_at: string;
  resolved_at?: string;
  resolution_code?: string;
  resolution_notes?: string;
  parent_incident?: string;
  child_incidents?: string[];
}

export interface TeamStats {
  teamName: string;
  totalAssigned: number;
  resolved: number;
  inProgress: number;
  avgResolutionTime: number;
}

export interface DashboardStats {
  unassigned: number;
  critical: number;
  overdue: number;
  resolvedToday: number;
  totalActive: number;
  inJeopardy: number;
  p1Count: number;
  awaitingApproval: number;
  teamStats: TeamStats[];
  impactBreakdown: {
    extensive: number;
    significant: number;
    moderate: number;
  };
}

export interface OrchestrationResponse {
  incident: {
    number: string;
    state: string;
    priority: string;
    shortDescription: string;
    service: string;
    affectedServiceType: string;
    subState: string;
    faultCause: string;
  };
  workflowState: {
    currentPhase: string;
  };
  slaStatus: {
    isJeopardy: boolean;
    slaHealth: string;
    estimatedCompletionDateTime: string;
    startDateTime: string;
  };
  tasks: Array<{
    taskType: string;
    assignmentGroup: string;
    state: string;
    blockingReason?: string;
  }>;
  approvalsAndDependencies: Array<{
    type: string;
    status: string;
    ownerGroup: string;
  }>;
  workNotes: string[];
  configurationItems: string[];
  recommendedNextActions: string[];
}
