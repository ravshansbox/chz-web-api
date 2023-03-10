import { createRequestListener } from '@ravshansbox/mini-app';
import { createServer } from 'node:http';
import { appRouter } from './appRouter';
import { HTTP_PORT } from './common/constants';
import { seedDatabase } from './common/seedDatabase';
import { prismaClient } from './prismaClient';

(async () => {
  await seedDatabase();
  const server = createServer();
  server.on('request', createRequestListener(appRouter.routes));
  server.on('listening', () => {
    console.log('Listening on', server.address());
  });
  server.listen(Number(HTTP_PORT));
})()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
