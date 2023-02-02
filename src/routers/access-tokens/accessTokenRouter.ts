import { createRouter } from '../../common/createRouter';
import { createAccessToken } from './createAccessToken';
import { getAccessToken } from './getAccessToken';

export const accessTokenRouter = createRouter();

accessTokenRouter.addRoute(createAccessToken);
accessTokenRouter.addRoute(getAccessToken);
