import { createRouter } from '../../common/createRouter';
import { createOrder } from './createOrder';

export const orderRouter = createRouter();

orderRouter.addRoute(createOrder);
