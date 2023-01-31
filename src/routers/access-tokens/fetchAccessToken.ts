import { z } from 'zod';
import { type Route } from '../../common/createRouter';
import { sendJson } from '../../common/json';
import { prismaClient } from '../../prismaClient';

const paramsSchema = z.object({
  id: z.string(),
});

export const fetchAccessToken: Route = {
  method: 'GET',
  path: '/:id',
  handler: async ({ params, response }) => {
    const parsedParams = paramsSchema.parse(params);
    const accessToken = await prismaClient.accessToken.findUnique({
      include: { user: { select: { id: true, username: true } } },
      where: { id: parsedParams.id },
    });
    if (accessToken === null) {
      sendJson(response, { message: 'Invalid access token id' }, 404);
      return;
    }
    sendJson(response, accessToken, 200);
  },
};
