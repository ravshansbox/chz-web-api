import { prismaClient } from '../prismaClient';
import { createId, sha256 } from './utils';

const defaultUsernames = ['alisher', 'botir', 'ravshan'];

export const seedDatabase = async () => {
  const userCount = await prismaClient.user.count();
  if (userCount === 0) {
    await prismaClient.user.createMany({
      data: defaultUsernames.map((defaultUsername) => ({
        id: createId(),
        username: defaultUsername,
        password_sha256: sha256('qwerty123456'),
      })),
    });
    console.info('Default users created');
  }
};
