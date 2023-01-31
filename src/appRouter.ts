import { createRouter } from './common/createRouter';
import { accessTokenRouter } from './routers/access-tokens/accessTokenRouter';
import { companyRouter } from './routers/companies/companyRouter';
import { customerRouter } from './routers/customers/customerRouter';
import { orderRouter } from './routers/orders/orderRouter';
import { productRouter } from './routers/products/productRouter';
import { userRouter } from './routers/users/userRouter';

export const appRouter = createRouter();

appRouter.addRouter('/access-tokens', accessTokenRouter);
appRouter.addRouter('/companies', companyRouter);
appRouter.addRouter('/customers', customerRouter);
appRouter.addRouter('/orders', orderRouter);
appRouter.addRouter('/products', productRouter);
appRouter.addRouter('/users', userRouter);
