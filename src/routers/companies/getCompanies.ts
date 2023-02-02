import { createRoute } from '../../common/createRoute';
import { sendJson } from '../../common/json';
import { parseAccessToken } from '../../common/parseAccessToken';
import { prismaClient } from '../../prismaClient';

export const getCompanies = createRoute('GET', '', async ({ request, response }) => {
  const accessToken = await parseAccessToken(request);
  const companies = await prismaClient.company.findMany({
    where: { permissions: { every: { user_id: accessToken.user_id } } },
  });
  sendJson(response, companies, 200);
});
