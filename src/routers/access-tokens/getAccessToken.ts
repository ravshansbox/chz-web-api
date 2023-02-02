import { z } from 'zod';
import { createRoute } from '../../common/createRouter';
import { sendJson } from '../../common/json';
import { prismaClient } from '../../prismaClient';

const paramsSchema = z.object({
  id: z.string(),
});

export const getAccessToken = createRoute(
  'GET',
  '/:id',
  async ({ pathParams: rawPathParams, response }) => {
    const pathParams = paramsSchema.parse(rawPathParams);
    const accessToken = await prismaClient.accessToken.findUnique({
      include: { user: { select: { id: true, username: true } } },
      where: { id: pathParams.id },
    });
    if (accessToken === null) {
      sendJson(response, { message: 'Invalid access token id' }, 404);
      return;
    }
    sendJson(response, accessToken, 200);
  },
);
