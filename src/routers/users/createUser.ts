import { z } from 'zod';
import { createRoute } from '../../common/createRouter';
import { parseJsonBody, sendJson } from '../../common/json';
import { createId, sha256 } from '../../common/utils';
import { prismaClient } from '../../prismaClient';

const bodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const createUser = createRoute('POST', '', async ({ request, response }) => {
  const body = bodySchema.parse(await parseJsonBody(request));
  const user = await prismaClient.user.create({
    data: {
      id: createId(),
      password_sha256: sha256(body.password),
      username: body.username,
    },
    select: { id: true, username: true },
  });
  sendJson(response, user, 201);
});
