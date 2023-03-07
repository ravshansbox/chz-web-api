import { parseJsonBody, type Route } from '@ravshansbox/mini-app';
import { z } from 'zod';
import { parseAccessToken } from '../../common/parseAccessToken';
import { sendJson } from '../../common/sendJson';
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
    const accessToken = await parseAccessToken(request);
    const body = validate(bodySchema, await parseJsonBody(request));
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
