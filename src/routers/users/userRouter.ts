import { createRouter } from '@ravshansbox/mini-app';
import { createUser } from './createUser';
import { getUsers } from './getUsers';

export const userRouter = createRouter();

userRouter.addRoute(getUsers);
userRouter.addRoute(createUser);
