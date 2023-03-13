import { sendJson, type Route } from '@ravshansbox/mini-app';
import { ok } from 'node:assert';
import { checkPermission } from '../../common/checkPermission';
import { parseAccessToken } from '../../common/parseAccessToken';
import { prismaClient } from '../../prismaClient';

export const getCustomers: Route = {
  method: 'GET',
  path: '',
  handler: async ({ searchParams, request, response }) => {
    const companyId = searchParams.get('company_id');
    ok(companyId, '"company_id" search param is required');
    const accessToken = await parseAccessToken(request);
    await checkPermission(companyId, accessToken.user_id);
    const customers = await prismaClient.customer.findMany({
      where: { company_id: companyId },
    });
    sendJson(response, customers, 200);
  },
};
