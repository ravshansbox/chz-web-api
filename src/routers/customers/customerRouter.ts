import { createRouter } from '../../common/createRouter';
import { createCustomer } from './createCustomer';
import { getCustomers } from './getCustomers';

export const customerRouter = createRouter();

customerRouter.addRoute(createCustomer);
customerRouter.addRoute(getCustomers);
