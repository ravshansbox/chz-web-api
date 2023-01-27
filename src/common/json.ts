import { IncomingMessage } from 'http';
import http from 'node:http';
import { CONTENT_TYPES, HEADERS } from './constants';
import { parseBody } from './parseBody';

export const parseJsonBody = async (request: IncomingMessage) => {
  if (request.headers[HEADERS.CONTENT_TYPE] !== CONTENT_TYPES.JSON) {
    return;
  }
  const body = await parseBody(request);
  const bodyString = body.toString();
  if (body.length === 0) {
    return;
  }
  try {
    return JSON.parse(bodyString);
  } catch (error) {
    console.error('Could not parse JSON');
    console.log(bodyString);
  }
};

export const sendJson = (response: http.ServerResponse, body: unknown) => {
  response.setHeader(HEADERS.CONTENT_TYPE, CONTENT_TYPES.JSON);
  response.end(JSON.stringify(body));
};
