import { sendJson, type Route } from '@ravshansbox/mini-app';
import { ok } from 'assert';
import { checkPermission } from '../../common/checkPermission';
import { parseAccessToken } from '../../common/parseAccessToken';
import { prismaClient } from '../../prismaClient';

export const getOrders: Route = {
  method: 'GET',
  path: '',
  handler: async ({ searchParams, request, response }) => {
    const accessToken = await parseAccessToken(request);
    const companyId = searchParams.get('company_id');
    ok(companyId, '"company_id" search param is required');
    await checkPermission(companyId, accessToken.user_id);
    const orders = await prismaClient.order.findMany({ where: { company_id: companyId } });
    sendJson(response, orders, 200);
  },
};
