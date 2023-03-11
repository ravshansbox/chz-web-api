import { sendJson, type Route } from '@ravshansbox/mini-app';
import { parseAccessToken } from '../../common/parseAccessToken';
import { prismaClient } from '../../prismaClient';

export const getCompanies: Route = {
  method: 'GET',
  path: '',
  handler: async ({ request, response }) => {
    const accessToken = await parseAccessToken(request);
    const companies = await prismaClient.company.findMany({
      where: { permissions: { every: { user_id: accessToken.user_id } } },
    });
    sendJson(response, companies, 200);
  },
};
