import { createRouter } from './common/createRouter';
import { userRouter } from './userRouter';

export const appRouter = createRouter();

appRouter.addRouter('/users', userRouter);
