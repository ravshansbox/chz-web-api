import { parseJsonBody, type Route } from '@ravshansbox/mini-app';
import { z } from 'zod';
import { checkPermission } from '../../common/checkPermission';
import { parseAccessToken } from '../../common/parseAccessToken';
import { sendJson } from '../../common/sendJson';
import { validate } from '../../common/validate';
import { prismaClient } from '../../prismaClient';

const bodySchema = z.object({
  company_id: z.string().uuid(),
});

export const getOrders: Route = {
  method: 'GET',
  path: '',
  handler: async ({ request, response }) => {
    const accessToken = await parseAccessToken(request);
    const body = validate(bodySchema, await parseJsonBody(request));
    await checkPermission(body.company_id, accessToken.user_id);
    const orders = await prismaClient.order.findMany({ where: { company_id: body.company_id } });
    sendJson(response, orders, 200);
  },
};
