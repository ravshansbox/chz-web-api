import http from 'node:http';

const server = http.createServer();

server.addListener('request', (_request, response) => {
  response.end(JSON.stringify({ text: 'hello' }));
});

server.addListener('listening', () => {
  console.log('Listening on', server.address());
});

server.listen(3000);
