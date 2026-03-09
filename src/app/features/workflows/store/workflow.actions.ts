import { createAction, props } from '@ngrx/store';
import { Workflow, WorkflowFilters, PaginatedWorkflows } from '../../../core/models';

export const loadWorkflows = createAction(
  '[Workflow] Load Workflows',
  props<{ filters: WorkflowFilters }>()
);
export const loadWorkflowsSuccess = createAction(
  '[Workflow] Load Workflows Success',
  props<{ result: PaginatedWorkflows }>()
);
export const loadWorkflowsFailure = createAction(
  '[Workflow] Load Workflows Failure',
  props<{ error: string }>()
);

export const loadWorkflowById = createAction(
  '[Workflow] Load Workflow By Id',
  props<{ id: string }>()
);
export const loadWorkflowByIdSuccess = createAction(
  '[Workflow] Load Workflow By Id Success',
  props<{ workflow: Workflow | null }>()
);
export const loadWorkflowByIdFailure = createAction(
  '[Workflow] Load Workflow By Id Failure',
  props<{ error: string }>()
);

export const createWorkflow = createAction(
  '[Workflow] Create Workflow',
  props<{ workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'> }>()
);
export const createWorkflowSuccess = createAction(
  '[Workflow] Create Workflow Success',
  props<{ workflow: Workflow }>()
);
export const createWorkflowFailure = createAction(
  '[Workflow] Create Workflow Failure',
  props<{ error: string }>()
);

export const updateWorkflow = createAction(
  '[Workflow] Update Workflow',
  props<{ id: string; workflow: Partial<Workflow> }>()
);
export const updateWorkflowSuccess = createAction(
  '[Workflow] Update Workflow Success',
  props<{ workflow: Workflow }>()
);
export const updateWorkflowFailure = createAction(
  '[Workflow] Update Workflow Failure',
  props<{ error: string }>()
);

export const deleteWorkflow = createAction(
  '[Workflow] Delete Workflow',
  props<{ id: string }>()
);
export const deleteWorkflowSuccess = createAction(
  '[Workflow] Delete Workflow Success',
  props<{ id: string }>()
);
export const deleteWorkflowFailure = createAction(
  '[Workflow] Delete Workflow Failure',
  props<{ error: string }>()
);

export const setFilters = createAction(
  '[Workflow] Set Filters',
  props<{ filters: Partial<WorkflowFilters> }>()
);

export const optimisticUpdateWorkflow = createAction(
  '[Workflow] Optimistic Update',
  props<{ workflow: Workflow }>()
);
export const optimisticDeleteWorkflow = createAction(
  '[Workflow] Optimistic Delete',
  props<{ id: string }>()
);
export const rollbackWorkflow = createAction(
  '[Workflow] Rollback',
  props<{ error: string }>()
);
