import { Route } from '../../common/createRouter';

export const fetchCompanies: Route = {
  method: 'GET',
  path: '',
  handler: async ({ response }) => {
    response.end();
  },
};
