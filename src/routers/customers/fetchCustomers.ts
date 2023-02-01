import { z } from 'zod';
import { checkPermission } from '../../common/checkPermission';
import { type Route } from '../../common/createRouter';
import { sendJson } from '../../common/json';
import { parseAccessToken } from '../../common/parseAccessToken';
import { prismaClient } from '../../prismaClient';

const querySchema = z.object({
  company_id: z.string().uuid(),
});

export const fetchCustomers: Route = {
  method: 'GET',
  path: '',
  handler: async ({ query: rawQuery, request, response }) => {
    const query = querySchema.parse(rawQuery);
    const accessToken = await parseAccessToken(request);
    await checkPermission(query.company_id, accessToken.user_id);
    const customers = await prismaClient.customer.findMany({
      where: { company_id: query.company_id },
    });
    sendJson(response, customers, 200);
  },
};
