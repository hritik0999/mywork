import { User } from '../models';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Admin', email: 'admin@test.com', role: 'admin' },
  { id: 'u2', name: 'Bob Manager', email: 'manager@test.com', role: 'manager' },
  { id: 'u3', name: 'Carol User', email: 'user@test.com', role: 'user' },
];
