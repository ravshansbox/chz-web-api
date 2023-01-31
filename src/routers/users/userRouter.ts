import { createRouter } from '../../common/createRouter';
import { createUser } from './createUser';
import { fetchUser } from './fetchUser';

export const userRouter = createRouter();

userRouter.addRoute(fetchUser);
userRouter.addRoute(createUser);
