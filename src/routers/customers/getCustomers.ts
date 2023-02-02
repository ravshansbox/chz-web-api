import { z } from 'zod';
import { checkPermission } from '../../common/checkPermission';
import { createRoute } from '../../common/createRouter';
import { sendJson } from '../../common/json';
import { parseAccessToken } from '../../common/parseAccessToken';
import { prismaClient } from '../../prismaClient';

const searchParamsSchema = z.object({
  company_id: z.string().uuid(),
});

export const getCustomers = createRoute(
  'GET',
  '',
  async ({ searchParams: rawSearchParams, request, response }) => {
    const searchParams = searchParamsSchema.parse(rawSearchParams);
    const accessToken = await parseAccessToken(request);
    await checkPermission(searchParams.company_id, accessToken.user_id);
    const customers = await prismaClient.customer.findMany({
      where: { company_id: searchParams.company_id },
    });
    sendJson(response, customers, 200);
  },
);
