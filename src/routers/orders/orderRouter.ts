import { createRouter } from '@ravshansbox/mini-app';
import { createOrder } from './createOrder';

export const orderRouter = createRouter();

orderRouter.addRoute(createOrder);
