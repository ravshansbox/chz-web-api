import { createRouter } from '../../common/createRouter';
import { createCompany } from './createCompany';
import { fetchCompanies } from './fetchCompanies';

export const companyRouter = createRouter();

companyRouter.addRoute(createCompany);
companyRouter.addRoute(fetchCompanies);
