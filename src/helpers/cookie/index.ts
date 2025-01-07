import { FastifyReply } from 'fastify';
import { ExpireTime } from '../../models/token/index.js';
import { getSeconds } from '../time/index.js';

export const setCookie = (
  reply: FastifyReply,
  name: string,
  value: string,
  maxAge?: ExpireTime | null,
  httpOnly: boolean = true
) =>
  reply.setCookie(name, value, {
    path: '/',
    httpOnly,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: getSeconds(maxAge ?? ExpireTime.Week),
  });

export const deleteCookie = (reply: FastifyReply, name: string) =>
  reply.setCookie(name, '', {
    path: '/',
    maxAge: 0,
  });
