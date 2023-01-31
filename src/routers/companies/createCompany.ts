import { z } from 'zod';
import { type Route } from '../../common/createRouter';
import { parseJsonBody } from '../../common/json';
import { parseAccessToken } from '../../common/parseAccessToken';
import { createId } from '../../common/utils';
import { prismaClient } from '../../prismaClient';

const bodySchema = z.object({
  name: z.string(),
});
export const createCompany: Route = {
  method: 'POST',
  path: '',
  handler: async ({ request }) => {
    const accessToken = await parseAccessToken(request);
    const body = bodySchema.parse(await parseJsonBody(request));
    const company = await prismaClient.company.create({
      data: { id: createId(), name: body.name },
    });
  },
};
