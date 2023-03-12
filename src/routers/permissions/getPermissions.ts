import { Route, sendJson } from '@ravshansbox/mini-app';
import { parseAccessToken } from '../../common/parseAccessToken';
import { prismaClient } from '../../prismaClient';

export const getPermissions: Route = {
  method: 'GET',
  path: '',
  handler: async ({ request, response }) => {
    const accessToken = await parseAccessToken(request);
    const permissions = await prismaClient.permission.findMany({
      include: { company: true },
      where: { user_id: accessToken.user_id },
    });
    sendJson(response, permissions, 200);
  },
};
