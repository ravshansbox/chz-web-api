import { createRouter } from './common/createRouter';
import { accessTokenRouter } from './routers/accessTokenRouter';
import { userRouter } from './routers/userRouter';

export const appRouter = createRouter();

appRouter.addRouter('/access-tokens', accessTokenRouter);
appRouter.addRouter('/users', userRouter);
