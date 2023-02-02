import { z } from 'zod';
import { checkPermission } from '../../common/checkPermission';
import { createRoute } from '../../common/createRouter';
import { parseJsonBody, sendJson } from '../../common/json';
import { parseAccessToken } from '../../common/parseAccessToken';
import { prismaClient } from '../../prismaClient';

const bodySchema = z.object({
  company_id: z.string().uuid(),
});

export const getOrders = createRoute('GET', '', async ({ request, response }) => {
  const accessToken = await parseAccessToken(request);
  const body = bodySchema.parse(await parseJsonBody(request));
  await checkPermission(body.company_id, accessToken.user_id);
  const orders = await prismaClient.order.findMany({ where: { company_id: body.company_id } });
  sendJson(response, orders, 200);
});
