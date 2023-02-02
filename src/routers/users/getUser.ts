import { createRoute } from '../../common/createRouter';
import { sendJson } from '../../common/json';
import { prismaClient } from '../../prismaClient';

export const getUser = createRoute('GET', '', async ({ response }) => {
  const users = await prismaClient.user.findMany({
    select: { id: true, username: true },
  });
  sendJson(response, users, 200);
});
