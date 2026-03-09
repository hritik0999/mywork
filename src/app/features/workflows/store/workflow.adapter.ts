import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Workflow } from '../../../core/models';

export const entityAdapter = createEntityAdapter<Workflow>({
  selectId: (w) => w.id,
  sortComparer: (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
});

export type WorkflowEntityState = EntityState<Workflow>;
