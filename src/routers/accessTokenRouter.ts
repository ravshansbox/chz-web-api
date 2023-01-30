import { z } from 'zod';
import { createRouter } from '../common/createRouter';
import { parseJsonBody, sendJson } from '../common/json';
import { createId, sha256 } from '../common/utils';
import { prismaClient } from '../prismaClient';

export const accessTokenRouter = createRouter();

const postBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

accessTokenRouter.addRoute('POST', '', async ({ request, response }) => {
  const body = postBodySchema.parse(await parseJsonBody(request));
  const user = await prismaClient.user.findUnique({ where: { username: body.username } });
  if (user === null) {
    sendJson(response, { message: 'Invalid username' }, 403);
    return;
  }
  if (user.password_sha256 !== sha256(body.password)) {
    sendJson(response, { message: 'Invalid password' }, 403);
    return;
  }
  const accessToken = await prismaClient.accessToken.create({
    data: { id: createId(), user_id: user.id },
    include: { user: { select: { username: true } } },
  });
  sendJson(response, accessToken, 201);
});

const paramsSchema = z.object({
  id: z.string(),
});

accessTokenRouter.addRoute('GET', '/:id', async ({ params, response }) => {
  const parsedParams = paramsSchema.parse(params);
  const accessToken = await prismaClient.accessToken.findUnique({
    include: { user: { select: { username: true } } },
    where: { id: parsedParams.id },
  });
  if (accessToken === null) {
    sendJson(response, { message: 'Invalid access token id' }, 404);
    return;
  }
  sendJson(response, accessToken, 200);
});
