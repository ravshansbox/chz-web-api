import { createRouter } from '@ravshansbox/mini-app';
import { createOrder } from './createOrder';
import { createOrderItem } from './createOrderItem';
import { getOrders } from './getOrders';

export const orderRouter = createRouter();

orderRouter.addRoute(createOrder);
orderRouter.addRoute(createOrderItem);
orderRouter.addRoute(getOrders);
