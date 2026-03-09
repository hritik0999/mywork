import { createReducer, on } from '@ngrx/store';
import { entityAdapter, WorkflowEntityState } from './workflow.adapter';
import * as Actions from './workflow.actions';
import { WorkflowFilters } from '../../../core/models';

export interface WorkflowState extends WorkflowEntityState {
  filters: WorkflowFilters;
  total: number;
  totalPages: number;
  loading: boolean;
  loadingById: boolean;
  error: string | null;
  selectedId: string | null;
}

const initialState: WorkflowState = {
  ...entityAdapter.getInitialState(),
  filters: { page: 1, pageSize: 10 },
  total: 0,
  totalPages: 0,
  loading: false,
  loadingById: false,
  error: null,
  selectedId: null,
};

export const workflowReducer = createReducer(
  initialState,
  on(Actions.loadWorkflows, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
    loading: true,
    error: null,
  })),
  on(Actions.loadWorkflowsSuccess, (state, { result }) => ({
    ...state,
    ...entityAdapter.setAll(result.data, state),
    total: result.total,
    totalPages: result.totalPages,
    loading: false,
    error: null,
  })),
  on(Actions.loadWorkflowsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(Actions.loadWorkflowById, (state) => ({
    ...state,
    loadingById: true,
    error: null,
  })),
  on(Actions.loadWorkflowByIdSuccess, (state, { workflow }) => {
    const next = workflow ? entityAdapter.upsertOne(workflow, state) : state;
    return {
      ...next,
      loadingById: false,
      selectedId: workflow?.id ?? null,
      error: null,
    };
  }),
  on(Actions.loadWorkflowByIdFailure, (state, { error }) => ({
    ...state,
    loadingById: false,
    error,
  })),

  on(Actions.createWorkflow, (state) => ({ ...state, error: null })),
  on(Actions.createWorkflowSuccess, (state, { workflow }) => ({
    ...state,
    ...entityAdapter.addOne(workflow, state),
    total: state.total + 1,
    error: null,
  })),
  on(Actions.createWorkflowFailure, (state, { error }) => ({ ...state, error })),

  on(Actions.updateWorkflow, (state) => ({ ...state, error: null })),
  on(Actions.updateWorkflowSuccess, (state, { workflow }) => ({
    ...state,
    ...entityAdapter.upsertOne(workflow, state),
    error: null,
  })),
  on(Actions.updateWorkflowFailure, (state, { error }) => ({ ...state, error })),

  on(Actions.deleteWorkflow, (state) => ({ ...state, error: null })),
  on(Actions.deleteWorkflowSuccess, (state, { id }) => ({
    ...state,
    ...entityAdapter.removeOne(id, state),
    total: Math.max(0, state.total - 1),
    selectedId: state.selectedId === id ? null : state.selectedId,
    error: null,
  })),
  on(Actions.deleteWorkflowFailure, (state, { error }) => ({ ...state, error })),

  on(Actions.setFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
  })),

  on(Actions.optimisticUpdateWorkflow, (state, { workflow }) => ({
    ...state,
    ...entityAdapter.upsertOne(workflow, state),
  })),
  on(Actions.optimisticDeleteWorkflow, (state, { id }) => ({
    ...state,
    ...entityAdapter.removeOne(id, state),
    total: Math.max(0, state.total - 1),
    selectedId: state.selectedId === id ? null : state.selectedId,
  })),
  on(Actions.rollbackWorkflow, (state, { error }) => ({
    ...state,
    error,
  }))
);
