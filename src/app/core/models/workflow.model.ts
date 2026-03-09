export type WorkflowStatus = 'Draft' | 'In Review' | 'Approved' | 'Rejected';
export type WorkflowPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Workflow {
  id: string;
  name: string;
  priority: WorkflowPriority;
  status: WorkflowStatus;
  assignedUserIds: string[];
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface WorkflowFilters {
  status?: WorkflowStatus;
  dateFrom?: string;
  dateTo?: string;
  assignedUserId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedWorkflows {
  data: Workflow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
