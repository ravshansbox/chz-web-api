import { z } from 'zod';
import { createApp } from './common/createApp';
import { parseJsonBody, sendJson } from './common/json';
import { omitProps, sha256 } from './common/utils';
import { prismaClient } from './prismaClient';

export const app = createApp();

app.get('/users', async ({ response }) => {
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
app.post('/users', async ({ request, response }) => {
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
