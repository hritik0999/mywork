import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { workflowReducer } from './features/workflows/store/workflow.reducer';
import { WorkflowEffects } from './features/workflows/store/workflow.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { WORKFLOW_BACKEND } from './core/backend/workflow-backend';
import { MockWorkflowBackend } from './core/backend/mock-workflow-backend';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideStore({ workflows: workflowReducer }),
    provideEffects(WorkflowEffects),
    provideStoreDevtools(),
    { provide: WORKFLOW_BACKEND, useClass: MockWorkflowBackend },
  ],
};
