import { HttpError } from '@ravshansbox/mini-app';
import type { IncomingMessage } from 'node:http';
import { prismaClient } from '../prismaClient';

export const parseAccessToken = async (request: IncomingMessage) => {
  const { authorization } = request.headers;
  if (authorization === undefined) {
    throw new HttpError('No Authorization header', 403);
  }
  const result = /Bearer (.+)/.exec(authorization);
  if (result === null) {
    throw new HttpError('Invalid Authorization header', 403);
  }
  const accessTokenId = result[1];
  const accessToken = await prismaClient.accessToken.findUnique({
    include: { user: { select: { id: true, username: true, is_root: true } } },
    where: { id: accessTokenId },
  });
  if (accessToken === null) {
    throw new HttpError('Invalid Access Token ID', 403);
  }
  return accessToken;
};
