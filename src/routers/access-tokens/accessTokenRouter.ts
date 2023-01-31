import { createRouter } from '../../common/createRouter';
import { createAccessToken } from './createAccessToken';
import { fetchAccessToken } from './fetchAccessToken';

export const accessTokenRouter = createRouter();

accessTokenRouter.addRoute(createAccessToken);
accessTokenRouter.addRoute(fetchAccessToken);
