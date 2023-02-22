import { createRouter } from '@ravshansbox/mini-app';
import { createCustomer } from './createCustomer';
import { getCustomers } from './getCustomers';

export const customerRouter = createRouter();

customerRouter.addRoute(createCustomer);
customerRouter.addRoute(getCustomers);
