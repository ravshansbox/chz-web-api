import { sendJson, type Route } from '@ravshansbox/mini-app';
import { parseAccessToken } from '../../common/parseAccessToken';
import { prismaClient } from '../../prismaClient';

export const deleteAccessToken: Route = {
  method: 'DELETE',
  path: '',
  handler: async ({ request, response }) => {
    const accessToken = await parseAccessToken(request);
    await prismaClient.accessToken.delete({ where: { id: accessToken.id } });
    sendJson(response, {}, 200);
  },
};
