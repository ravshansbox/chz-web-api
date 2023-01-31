import { User } from '@prisma/client';
import { prismaClient } from '../prismaClient';
import { DEFAULT_USERNAMES, DEFAULT_USER_PASSWORD } from './constants';
import { createId, sha256 } from './utils';

export const seedDatabase = async () => {
  const userCount = await prismaClient.user.count();
  if (userCount === 0) {
    await prismaClient.user.createMany({
      data: DEFAULT_USERNAMES.split(',').map(
        (username): User => ({
          id: createId(),
          username,
          password_sha256: sha256(DEFAULT_USER_PASSWORD),
          type: 'ROOT',
        }),
      ),
    });
    console.info('Default users created');
  }
};
