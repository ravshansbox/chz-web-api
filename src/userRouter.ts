import { z } from 'zod';
import { createRouter } from './common/createRouter';
import { parseJsonBody, sendJson } from './common/json';
import { omitProps, sha256 } from './common/utils';
import { prismaClient } from './prismaClient';

export const userRouter = createRouter();

userRouter.addRoute('GET', '', async ({ response }) => {
  const users = await prismaClient.user.findMany({});
  sendJson(
    response,
    users.map((user) => omitProps(user, ['password_sha256'])),
  );
});

const UserPostSchema = z.object({
  username: z.string(),
  password: z.string(),
});
userRouter.addRoute('POST', '', async ({ request, response }) => {
  const body = await parseJsonBody(request);
  const parsedBody = UserPostSchema.parse(body);
  const user = await prismaClient.user.create({
    data: {
      username: parsedBody.username,
      password_sha256: sha256(parsedBody.password),
    },
  });
  sendJson(response, omitProps(user, ['password_sha256']));
});
