import { HttpError, sendJson, type Route } from '@ravshansbox/mini-app';
import { parseAccessToken } from '../../common/parseAccessToken';
import { prismaClient } from '../../prismaClient';

export const getUsers: Route = {
  method: 'GET',
  path: '',
  handler: async ({ request, response }) => {
    const accessToken = await parseAccessToken(request);
    if (!accessToken.user.is_root) {
      throw new HttpError('Root permission required', 403);
    }
    const users = await prismaClient.user.findMany({
      select: { id: true, username: true, is_root: true },
    });
    sendJson(response, users, 200);
  },
};
