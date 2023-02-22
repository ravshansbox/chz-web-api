import { parseJsonBody, sendJson, type Route } from '@ravshansbox/mini-app';
import { z } from 'zod';
import { createId, sha256 } from '../../common/utils';
import { validate } from '../../common/validate';
import { prismaClient } from '../../prismaClient';

const bodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const createUser: Route = {
  method: 'POST',
  path: '',
  handler: async ({ request, response }) => {
    const body = validate(bodySchema, await parseJsonBody(request));
    const user = await prismaClient.user.create({
      data: {
        id: createId(),
        password_sha256: sha256(body.password),
        username: body.username,
        is_root: false,
      },
      select: { id: true, username: true },
    });
    sendJson(response, user, 201);
  },
};
