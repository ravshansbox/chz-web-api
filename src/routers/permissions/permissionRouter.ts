import { createRouter } from '@ravshansbox/mini-app';
import { getPermissions } from './getPermissions';

export const permissionRouter = createRouter();

permissionRouter.addRoute(getPermissions);
