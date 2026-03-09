import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import { WorkflowApiService } from '../../../core/services/workflow-api.service';
import * as WorkflowActions from './workflow.actions';

@Injectable()
export class WorkflowEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(WorkflowApiService);

  loadWorkflows$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowActions.loadWorkflows),
      exhaustMap(({ filters }) =>
        this.api.getWorkflows(filters).pipe(
          map((result) => WorkflowActions.loadWorkflowsSuccess({ result })),
          catchError((err) => of(WorkflowActions.loadWorkflowsFailure({ error: err?.message || 'Failed to load' })))
        )
      )
    )
  );

  loadWorkflowById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowActions.loadWorkflowById),
      exhaustMap(({ id }) =>
        this.api.getWorkflowById(id).pipe(
          map((workflow) => WorkflowActions.loadWorkflowByIdSuccess({ workflow })),
          catchError((err) => of(WorkflowActions.loadWorkflowByIdFailure({ error: err?.message || 'Failed to load' })))
        )
      )
    )
  );

  createWorkflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowActions.createWorkflow),
      exhaustMap(({ workflow }) =>
        this.api.createWorkflow(workflow).pipe(
          map((w) => WorkflowActions.createWorkflowSuccess({ workflow: w })),
          catchError((err) => of(WorkflowActions.createWorkflowFailure({ error: err?.message || 'Failed to create' })))
        )
      )
    )
  );

  updateWorkflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowActions.updateWorkflow),
      exhaustMap(({ id, workflow }) =>
        this.api.updateWorkflow(id, workflow).pipe(
          map((w) => WorkflowActions.updateWorkflowSuccess({ workflow: w })),
          catchError((err) => of(WorkflowActions.updateWorkflowFailure({ error: err?.message || 'Failed to update' })))
        )
      )
    )
  );

  deleteWorkflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowActions.deleteWorkflow),
      exhaustMap(({ id }) =>
        this.api.deleteWorkflow(id).pipe(
          map(() => WorkflowActions.deleteWorkflowSuccess({ id })),
          catchError((err) => of(WorkflowActions.deleteWorkflowFailure({ error: err?.message || 'Failed to delete' })))
        )
      )
    )
  );
}
