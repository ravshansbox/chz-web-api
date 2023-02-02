import { createRouter } from '../../common/createRouter';
import { createUser } from './createUser';
import { getUser } from './getUser';

export const userRouter = createRouter();

userRouter.addRoute(getUser);
userRouter.addRoute(createUser);
