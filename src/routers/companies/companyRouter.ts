import { createRouter } from '../../common/createRouter';
import { createCompany } from './createCompany';
import { getCompanies } from './getCompanies';

export const companyRouter = createRouter();

companyRouter.addRoute(createCompany);
companyRouter.addRoute(getCompanies);
