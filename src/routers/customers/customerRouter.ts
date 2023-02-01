import { createRouter } from '../../common/createRouter';
import { createCustomer } from './createCustomer';
import { fetchCustomers } from './fetchCustomers';

export const customerRouter = createRouter();

customerRouter.addRoute(createCustomer);
customerRouter.addRoute(fetchCustomers);
