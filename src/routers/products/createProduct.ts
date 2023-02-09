import { z } from 'zod';
import { checkPermission } from '../../common/checkPermission';
import { parseJsonBody, sendJson } from '../../common/json';
import { parseAccessToken } from '../../common/parseAccessToken';
import { Route } from '../../common/types';
import { createId } from '../../common/utils';
import { validate } from '../../common/validate';
import { prismaClient } from '../../prismaClient';

const bodySchema = z.object({
  company_id: z.string().uuid(),
  name: z.string(),
});

export const createProduct: Route = {
  method: 'POST',
  path: '',
  handler: async ({ request, response }) => {
    const body = validate(bodySchema, await parseJsonBody(request));
    const accessToken = await parseAccessToken(request);
    await checkPermission(body.company_id, accessToken.user_id);
    const product = await prismaClient.product.create({
      data: { id: createId(), company_id: body.company_id, name: body.name },
    });
    sendJson(response, product, 201);
  },
};
