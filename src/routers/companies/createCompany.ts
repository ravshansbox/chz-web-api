import { parseJsonBody, sendJson, type Route } from '@ravshansbox/mini-app';
import { z } from 'zod';
import { parseAccessToken } from '../../common/parseAccessToken';
import { createId } from '../../common/utils';
import { validate } from '../../common/validate';
import { prismaClient } from '../../prismaClient';

const bodySchema = z.object({
  name: z.string(),
});

export const createCompany: Route = {
  method: 'POST',
  path: '',
  handler: async ({ request, response }) => {
    const body = validate(bodySchema, await parseJsonBody(request));
    const accessToken = await parseAccessToken(request);
    const company = await prismaClient.company.create({
      data: { id: createId(), name: body.name },
    });
    await prismaClient.permission.create({
      data: {
        id: createId(),
        company_id: company.id,
        user_id: accessToken.user_id,
        type: 'MANAGER',
      },
    });
    sendJson(response, company, 201);
  },
};
