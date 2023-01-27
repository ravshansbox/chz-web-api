import { createServer } from 'node:http';
import { app } from './app';
import { prismaClient } from './prismaClient';

const main = async () => {
  const server = createServer();

  server.on('request', app.requestListener);

  server.on('listening', () => {
    console.log('Listening on', server.address());
  });

  server.listen(process.env.HTTP_PORT);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
