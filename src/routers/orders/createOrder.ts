import { parseJsonBody, sendJson, type Route } from '@ravshansbox/mini-app';
import { z } from 'zod';
import { checkPermission } from '../../common/checkPermission';
import { parseAccessToken } from '../../common/parseAccessToken';
import { createId } from '../../common/utils';
import { validate } from '../../common/validate';
import { prismaClient } from '../../prismaClient';

const bodySchema = z.object({
  company_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  shipping_due_date: z.string().datetime(),
});

export const createOrder: Route = {
  method: 'POST',
  path: '',
  handler: async ({ request, response }) => {
    const body = validate(bodySchema, await parseJsonBody(request));
    const accessToken = await parseAccessToken(request);
    await checkPermission(body.company_id, accessToken.user_id);
    const order = await prismaClient.order.create({
      data: {
        id: createId(),
        company_id: body.company_id,
        customer_id: body.customer_id,
        shipping_due_date: body.shipping_due_date,
      },
    });
    sendJson(response, order, 201);
  },
};
