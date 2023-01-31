import { User, UserType } from '@prisma/client';
import { z } from 'zod';
import { createRouter } from '../common/createRouter';
import { parseJsonBody, sendJson } from '../common/json';
import { createId, omitProps, sha256 } from '../common/utils';
import { prismaClient } from '../prismaClient';

export const userRouter = createRouter();

const omitColumns = (user: User) => omitProps(user, ['password_sha256']);

userRouter.addRoute('GET', '', async ({ response }) => {
  const users = await prismaClient.user.findMany({});
  sendJson(response, users.map(omitColumns), 200);
});

const UserPostBodySchema = z.object({
  username: z.string(),
  password: z.string(),
  type: z.nativeEnum(UserType),
});
userRouter.addRoute('POST', '', async ({ request, response }) => {
  const body = await parseJsonBody(request);
  const parsedBody = UserPostBodySchema.parse(body);
  const user = await prismaClient.user.create({
    data: {
      id: createId(),
      username: parsedBody.username,
      password_sha256: sha256(parsedBody.password),
      type: parsedBody.type,
    },
  });
  sendJson(response, omitColumns(user), 201);
});
