import { parseJsonBody, sendJson, type Route } from '@ravshansbox/mini-app';
import { z } from 'zod';
import { checkPermission } from '../../common/checkPermission';
import { parseAccessToken } from '../../common/parseAccessToken';
import { createId } from '../../common/utils';
import { validate } from '../../common/validate';
import { prismaClient } from '../../prismaClient';

const bodySchema = z.object({
  company_id: z.string().uuid(),
  name: z.string(),
});

export const createCustomer: Route = {
  method: 'POST',
  path: '',
  handler: async ({ request, response }) => {
    const body = validate(bodySchema, await parseJsonBody(request));
    const accessToken = await parseAccessToken(request);
    await checkPermission(body.company_id, accessToken.user_id);
    const customer = await prismaClient.customer.create({
      data: { id: createId(), company_id: body.company_id, name: body.name },
    });
    sendJson(response, customer, 201);
  },
};
