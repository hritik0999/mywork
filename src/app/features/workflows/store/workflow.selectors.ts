import { createFeatureSelector, createSelector } from '@ngrx/store';
import { entityAdapter } from './workflow.adapter';
import { WorkflowState } from './workflow.reducer';

export const selectWorkflowState = createFeatureSelector<WorkflowState>('workflows');

export const {
  selectAll: selectAllWorkflows,
  selectEntities: selectWorkflowEntities,
  selectIds: selectWorkflowIds,
  selectTotal: selectWorkflowTotal,
} = entityAdapter.getSelectors(selectWorkflowState);

export const selectWorkflowFilters = createSelector(
  selectWorkflowState,
  (state) => state.filters
);
export const selectWorkflowTotalCount = createSelector(
  selectWorkflowState,
  (state) => state.total
);
export const selectWorkflowTotalPages = createSelector(
  selectWorkflowState,
  (state) => state.totalPages
);
export const selectWorkflowsLoading = createSelector(
  selectWorkflowState,
  (state) => state.loading
);
export const selectWorkflowLoadingById = createSelector(
  selectWorkflowState,
  (state) => state.loadingById
);
export const selectWorkflowError = createSelector(
  selectWorkflowState,
  (state) => state.error
);
export const selectSelectedWorkflowId = createSelector(
  selectWorkflowState,
  (state) => state.selectedId
);
export const selectSelectedWorkflow = createSelector(
  selectWorkflowEntities,
  selectSelectedWorkflowId,
  (entities, id) => (id ? entities[id] ?? null : null)
);
