import { createRouter } from '@ravshansbox/mini-app';
import { accessTokenRouter } from './routers/access-tokens/accessTokenRouter';
import { companyRouter } from './routers/companies/companyRouter';
import { customerRouter } from './routers/customers/customerRouter';
import { orderRouter } from './routers/orders/orderRouter';
import { permissionRouter } from './routers/permissions/permissionRouter';
import { productRouter } from './routers/products/productRouter';
import { userRouter } from './routers/users/userRouter';

export const appRouter = createRouter();

appRouter.addRoutes('/access-tokens', accessTokenRouter.routes);
appRouter.addRoutes('/companies', companyRouter.routes);
appRouter.addRoutes('/customers', customerRouter.routes);
appRouter.addRoutes('/orders', orderRouter.routes);
appRouter.addRoutes('/products', productRouter.routes);
appRouter.addRoutes('/permissions', permissionRouter.routes);
appRouter.addRoutes('/users', userRouter.routes);
