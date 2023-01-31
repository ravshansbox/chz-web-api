import { type Route } from '../../common/createRouter';
import { sendJson } from '../../common/json';
import { prismaClient } from '../../prismaClient';

export const fetchUser: Route = {
  method: 'GET',
  path: '',
  handler: async ({ response }) => {
    const users = await prismaClient.user.findMany({
      select: { id: true, username: true },
    });
    sendJson(response, users, 200);
  },
};
