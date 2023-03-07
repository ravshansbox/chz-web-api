import { parseJsonBody, type Route } from '@ravshansbox/mini-app';
import { z } from 'zod';
import { sendJson } from '../../common/sendJson';
import { createId, sha256 } from '../../common/utils';
import { validate } from '../../common/validate';
import { prismaClient } from '../../prismaClient';

const bodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const createAccessToken: Route = {
  method: 'POST',
  path: '',
  handler: async ({ request, response }) => {
    const body = validate(bodySchema, await parseJsonBody(request));
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
      include: { user: { select: { id: true, username: true } } },
    });
    sendJson(response, accessToken, 201);
  },
};
