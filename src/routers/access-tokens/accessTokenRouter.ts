import { createRouter } from '@ravshansbox/mini-app';
import { createAccessToken } from './createAccessToken';
import { deleteAccessToken } from './deleteAccessToken';
import { getAccessToken } from './getAccessToken';

export const accessTokenRouter = createRouter();

accessTokenRouter.addRoute(createAccessToken);
accessTokenRouter.addRoute(deleteAccessToken);
accessTokenRouter.addRoute(getAccessToken);
