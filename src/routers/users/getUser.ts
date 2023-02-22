import { sendJson, type Route } from '@ravshansbox/mini-app';
import { prismaClient } from '../../prismaClient';

export const getUser: Route = {
  method: 'GET',
  path: '',
  handler: async ({ response }) => {
    const users = await prismaClient.user.findMany({
      select: { id: true, username: true },
    });
    sendJson(response, users, 200);
  },
};
