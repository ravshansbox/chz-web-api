import { createServer } from 'node:http';
import { appRouter } from './appRouter';
import { HTTP_PORT } from './common/constants';
import { seedDatabase } from './common/seedDatabase';
import { prismaClient } from './prismaClient';

const main = async () => {
  await seedDatabase();

  const server = createServer();
  server.on('request', appRouter.requestListener);
  server.on('listening', () => {
    console.log('Listening on', server.address());
  });
  server.listen(Number(HTTP_PORT));
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
