import { sendJson as _sendJson } from '@ravshansbox/mini-app';
import { ServerResponse } from 'node:http';
import { version } from '../../package.json';
import { HEADERS } from './constants';

export const sendJson = (response: ServerResponse, payload: any, statusCode: number) => {
  response.setHeader(HEADERS.X_APP_VERSION, version);
  return _sendJson(response, payload, statusCode);
};
